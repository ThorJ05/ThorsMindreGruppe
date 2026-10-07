using Service.Dtos;

namespace Service;

public interface IOrderService
{
    Task<List<OrderDto>> GetAllAsync();
    Task<OrderDto?> GetByIdAsync(int id);
    Task<(bool Success, string? Error, OrderDto? Order)> CheckoutAsync(CheckoutRequest request);
}