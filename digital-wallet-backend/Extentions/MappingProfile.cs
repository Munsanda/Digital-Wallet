using System.Transactions;
using AutoMapper;
using digital_wallet_backend.DTOs;
using digital_wallet_backend.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<digital_wallet_backend.Models.Transaction, TransactionDTO>();
        CreateMap<TransactionDTO, digital_wallet_backend.Models.Transaction>();
        CreateMap<digital_wallet_backend.Models.Wallet, UpdateWalletDTO>();
        CreateMap<UpdateWalletDTO, digital_wallet_backend.Models.Wallet>();
    }
}