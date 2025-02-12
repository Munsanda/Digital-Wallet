using System.Transactions;
using AutoMapper;
using digital_wallet_backend.DTOs;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<digital_wallet_backend.Models.Transaction, TransactionDTO>();
        CreateMap<TransactionDTO, digital_wallet_backend.Models.Transaction>();

    }
}