using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OnlineStore.BLL;
using OnlineStore.Models;
using OnlineStoreAPI.DTOs;
using OnlineStoreAPI.Services;
using System.Security.Claims;

namespace OnlineStoreAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ILogger<AuthController> _logger;

        public AuthController(JwtService jwtService, IPasswordHasher passwordHasher, ILogger<AuthController> logger)
        {
            _jwtService = jwtService;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<AuthResponseDTO> Login([FromBody] LoginRequestDTO loginRequest)
        {
            _logger.LogInformation("Login attempt for username: {Username}", loginRequest.Username);

            if (string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
            {
                _logger.LogWarning("Login failed: Missing username or password");
                return BadRequest(new { message = "Username and password are required" });
            }

            // Find customer by username
            var customer = Customer.FindByUsername(loginRequest.Username);

            if (customer == null)
            {
                _logger.LogWarning("Login failed: Username {Username} not found", loginRequest.Username);
                return Unauthorized(new { message = "Invalid username or password" });
            }

            // Verify password using BCrypt
            bool isPasswordValid = _passwordHasher.VerifyPassword(loginRequest.Password, customer.Password);
            
            if (!isPasswordValid)
            {
                _logger.LogWarning("Login failed: Invalid password for username {Username}", loginRequest.Username);
                return Unauthorized(new { message = "Invalid username or password" });
            }

            _logger.LogInformation("Login successful for username: {Username} (ID: {CustomerID})", 
                loginRequest.Username, customer.CustomerID);

            // Generate JWT token with role
            var token = _jwtService.GenerateToken(customer.CustomerID!.Value, customer.Username, customer.Role);

            // Remove password from response
            var customerDto = customer.CustomerDTO;
            customerDto.Password = null!; // Don't return password

            return Ok(new AuthResponseDTO
            {
                Customer = customerDto,
                Token = token
            });
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<AuthResponseDTO> Register([FromBody] RegisterRequestDTO registerRequest)
        {
            _logger.LogInformation("Registration attempt for username: {Username}", registerRequest.Username);

            // Validate input
            if (string.IsNullOrEmpty(registerRequest.Username) || 
                string.IsNullOrEmpty(registerRequest.Password) ||
                string.IsNullOrEmpty(registerRequest.Name) ||
                string.IsNullOrEmpty(registerRequest.Email))
            {
                _logger.LogWarning("Registration failed: Missing required fields");
                return BadRequest(new { message = "Name, email, username, and password are required" });
            }

            // Validate password length
            if (registerRequest.Password.Length < 6)
            {
                _logger.LogWarning("Registration failed: Password too short");
                return BadRequest(new { message = "Password must be at least 6 characters long" });
            }

            // Check if username already exists
            var existingCustomer = Customer.FindByUsername(registerRequest.Username);
            if (existingCustomer != null)
            {
                _logger.LogWarning("Registration failed: Username {Username} already exists", registerRequest.Username);
                return BadRequest(new { message = "Username already exists" });
            }

            try
            {
                // Hash the password using BCrypt
                string hashedPassword = _passwordHasher.HashPassword(registerRequest.Password);
                _logger.LogInformation("Password hashed successfully for user: {Username}", registerRequest.Username);

                // Create new customer with hashed password and default "Customer" role
                var newCustomer = new Customer(new CustomerDTO(
                    null,
                    registerRequest.Name,
                    registerRequest.Email,
                    registerRequest.Phone ?? string.Empty,
                    registerRequest.Address ?? string.Empty,
                    registerRequest.Username,
                    hashedPassword,  // Store hashed password
                    "Customer" // Default role for new registrations
                ));

                if (!newCustomer.Save())
                {
                    _logger.LogError("Failed to save customer: {Username}", registerRequest.Username);
                    return StatusCode(StatusCodes.Status500InternalServerError, 
                        new { message = "Error creating account" });
                }

                _logger.LogInformation("Customer registered successfully: {Username} (ID: {CustomerID})", 
                    registerRequest.Username, newCustomer.CustomerID);

                // Generate JWT token with role
                var token = _jwtService.GenerateToken(newCustomer.CustomerID!.Value, newCustomer.Username, newCustomer.Role);

                // Remove password from response
                var customerDto = newCustomer.CustomerDTO;
                customerDto.Password = null!;

                return CreatedAtRoute("GetCurrentUser", null, new AuthResponseDTO
                {
                    Customer = customerDto,
                    Token = token
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for username: {Username}", registerRequest.Username);
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { message = "An error occurred during registration", details = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me", Name = "GetCurrentUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<CustomerDTO> GetCurrentUser()
        {
            try
            {
                // Log authentication status
                _logger.LogInformation("GetCurrentUser called. User.Identity.IsAuthenticated: {IsAuthenticated}", 
                    User.Identity?.IsAuthenticated);

                // Log all claims
                foreach (var claim in User.Claims)
                {
                    _logger.LogInformation("Claim: {Type} = {Value}", claim.Type, claim.Value);
                }

                // Get customer ID from JWT claims
                var customerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                
                if (customerIdClaim == null)
                {
                    _logger.LogWarning("NameIdentifier claim not found in token");
                    return Unauthorized(new { message = "Invalid token - missing customer ID" });
                }

                _logger.LogInformation("Customer ID from claim: {CustomerId}", customerIdClaim.Value);

                if (!int.TryParse(customerIdClaim.Value, out int customerId))
                {
                    _logger.LogWarning("Failed to parse customer ID: {CustomerId}", customerIdClaim.Value);
                    return Unauthorized(new { message = "Invalid token - invalid customer ID format" });
                }

                var customer = Customer.Find(customerId);

                if (customer == null)
                {
                    _logger.LogWarning("Customer not found in database: {CustomerId}", customerId);
                    return NotFound(new { message = "Customer not found" });
                }

                _logger.LogInformation("Customer found successfully: {CustomerId}", customerId);

                var customerDto = customer.CustomerDTO;
                customerDto.Password = null!; // Don't return password

                return Ok(customerDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetCurrentUser");
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { message = "An error occurred", details = ex.Message });
            }
        }
    }
}
