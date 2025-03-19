using Microsoft.AspNetCore.Mvc;
using Core.Entities;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace BackendAPI.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly AuthService _authService;

        public AuthController(ApplicationDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(User user)
        {
            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
                return BadRequest("Username already exists.");

            user.PasswordHash = HashPassword(user.PasswordHash);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var response = new
            {
                User =  new {
                    UserId = user.Id,
                    Username = user.Username,
                },
                Message = "User registered successfully",
                success = true
            };
            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
            if (existingUser == null || !VerifyPassword(user.PasswordHash, existingUser.PasswordHash))
                return Unauthorized("Invalid credentials.");

            string token = _authService.GenerateJwtToken(existingUser);
            var response = new
            {
                User =  new {
                    UserId = existingUser.Id,
                    Username = existingUser.Username,
                },
                Token = token,
                success = true,
                Message = "User Logged In successfully"
            };
            return Ok(response);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string inputPassword, string storedHash)
        {
            return HashPassword(inputPassword) == storedHash;
        }
    }
}
