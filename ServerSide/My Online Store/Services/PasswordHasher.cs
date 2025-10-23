namespace OnlineStoreAPI.Services
{
    /// <summary>
    /// Service for secure password hashing and verification using BCrypt
    /// </summary>
    public interface IPasswordHasher
    {
        /// <summary>
        /// Hashes a plain text password using BCrypt
        /// </summary>
        /// <param name="password">Plain text password</param>
        /// <returns>Hashed password</returns>
        string HashPassword(string password);

        /// <summary>
        /// Verifies a plain text password against a hashed password
        /// </summary>
        /// <param name="password">Plain text password</param>
        /// <param name="hashedPassword">Hashed password from database</param>
        /// <returns>True if password matches, false otherwise</returns>
        bool VerifyPassword(string password, string hashedPassword);
    }

    /// <summary>
    /// Implementation of password hashing using BCrypt
    /// BCrypt automatically handles salting and uses adaptive hashing
    /// </summary>
    public class PasswordHasher : IPasswordHasher
    {
        // WorkFactor determines the computational cost
        // 12 is a good balance between security and performance
        // Higher = more secure but slower (increases exponentially)
        private const int WorkFactor = 12;

        /// <summary>
        /// Hashes a password using BCrypt with automatic salt generation
        /// </summary>
        /// <param name="password">Plain text password to hash</param>
        /// <returns>BCrypt hashed password (includes salt)</returns>
        /// <exception cref="ArgumentNullException">If password is null or empty</exception>
        public string HashPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentNullException(nameof(password), "Password cannot be null or empty");
            }

            // BCrypt automatically generates a salt and includes it in the hash
            // Format: $2a$[cost]$[22 character salt][31 character hash]
            return BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
        }

        /// <summary>
        /// Verifies a password against a BCrypt hash
        /// </summary>
        /// <param name="password">Plain text password to verify</param>
        /// <param name="hashedPassword">BCrypt hash from database</param>
        /// <returns>True if password is correct, false otherwise</returns>
        public bool VerifyPassword(string password, string hashedPassword)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                return false;
            }

            if (string.IsNullOrWhiteSpace(hashedPassword))
            {
                return false;
            }

            try
            {
                // BCrypt extracts the salt from the hash and verifies
                return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
            }
            catch (Exception)
            {
                // Invalid hash format or other BCrypt error
                return false;
            }
        }
    }
}
