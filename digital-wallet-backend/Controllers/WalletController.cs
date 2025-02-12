using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using digital_wallet_backend.Services;
using digital_wallet_backend.Models;
using digital_wallet_backend.Data;
using Microsoft.EntityFrameworkCore;
using digital_wallet_backend.DTOs;
using AutoMapper;

namespace digital_wallet_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WalletController : ControllerBase
    {
        private readonly IDigitalWallet<Transaction> _transactionService;
        private readonly IDigitalWallet<Wallet> _walletService;
        private readonly DigitalWalletDbContext _context;

        private readonly IMapper _mapper;

        public WalletController(IDigitalWallet<Transaction> transactionService, 
                                IDigitalWallet<Wallet> walletService,  
                                DigitalWalletDbContext context,
                                IMapper mapper)
        {
            _transactionService = transactionService;
            _walletService = walletService;
            _context = context;
            _mapper = mapper;
        }

        // Get Wallet Balance
        [HttpGet("balance/{walletId}")]
        public async Task<ActionResult<decimal>> GetBalance(int walletId)
        {
            var wallet = await _walletService.GetByIdAsync(walletId);
            if (wallet == null)
                return NotFound("Wallet not found");
            return Ok(wallet.Balance);
        }

        // Get Recent Transactions with Pagination
        [HttpGet("transactions/{walletId}")]
        public async Task<ActionResult<IEnumerable<TransactionDTO>>> GetTransactions(int walletId, int page = 1, int pageSize = 10)
        {
            var transactions = await _transactionService.GetAllAsync(walletId);
            var paginatedTransactions = transactions
                .OrderByDescending(t => t.Timestamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize);
            return Ok(paginatedTransactions);
        }

        // Send Money
        [HttpPost("transfer")]
        public async Task<ActionResult> TransferMoney([FromBody] TransactionDTO transaction)
        {
            var senderWallet = await _walletService.GetByIdAsync(transaction.SenderWalletId);
            var receiverWallet = await _walletService.GetByIdAsync(transaction.ReceiverWalletId);

            if (senderWallet == null || receiverWallet == null)
                return NotFound("Sender or Receiver wallet not found");

            if (senderWallet.Balance < transaction.Amount)
                return BadRequest("Insufficient balance");

            senderWallet.Balance -= transaction.Amount;
            receiverWallet.Balance += transaction.Amount;

            await _walletService.UpdateAsync(senderWallet.Id, senderWallet);
            await _walletService.UpdateAsync(receiverWallet.Id, receiverWallet);
            await _transactionService.CreateAsync(_mapper.Map<Transaction>(transaction));

            return Ok(new { message = "Transaction successful", newBalance = senderWallet.Balance });
        }

        // Search Recipients
        [HttpGet("recipients")]
        public async Task<ActionResult<IEnumerable<object>>> SearchRecipients(string query)
        {
            var users = await _context.Set<ApplicationUser>().Where(u => u.FullName.Contains(query, StringComparison.OrdinalIgnoreCase))
            .Include(u => u.Wallet)
            .ToListAsync();

            var recipientWallets = users.Select(u => new { u.FullName, u.Wallet.Id });
            return Ok(recipientWallets);
        }
    }
}
