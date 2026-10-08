using Infrastructure;
using Moq;
using Service;
using Service.Dtos;

namespace Tests;

public class OrderServiceTests
{
    // ---- Test doubles ----------------------------------------------------

    private class NoRaidRandom : IRandomProvider
    {
        public double NextDouble() => 1.0;   // > any threshold → never fires
    }

    private class AlwaysRaidRandom : IRandomProvider
    {
        public double NextDouble() => 0.0;   // < any threshold → always fires
    }

    private static Listing MakeListing(int id, decimal price, int stock, bool active = true) => new()
    {
        Id = id,
        Title = $"Item {id}",
        Price = price,
        Stock = stock,
        IsActive = active,
        IsOutOfStock = stock == 0,
        CategoryId = 1,
    };

    // ---- Tests -----------------------------------------------------------

    [Fact]
    public async Task Checkout_WithEmptyCart_ReturnsError()
    {
        var orderRepo = new Mock<IOrderRepository>();
        var listingRepo = new Mock<IListingRepository>();
        var shopRepo = new Mock<IShopStateRepository>();
        shopRepo.Setup(s => s.GetAsync()).ReturnsAsync(new ShopState { Id = 1, IsSeized = false });

        var service = new OrderService(orderRepo.Object, listingRepo.Object, shopRepo.Object, new NoRaidRandom());

        var (success, error, _, _) = await service.CheckoutAsync(new CheckoutRequest { Items = new() });

        Assert.False(success);
        Assert.Equal("Cart is empty Brother.", error);
    }

    [Fact]
    public async Task Checkout_WithSeizedListing_ReturnsError()
    {
        var listing = MakeListing(1, 100m, 5, active: false);

        var orderRepo = new Mock<IOrderRepository>();
        var listingRepo = new Mock<IListingRepository>();
        listingRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(listing);
        var shopRepo = new Mock<IShopStateRepository>();

        var service = new OrderService(orderRepo.Object, listingRepo.Object, shopRepo.Object, new NoRaidRandom());

        var request = new CheckoutRequest
        {
            Items = new() { new CheckoutItemRequest { ListingId = 1, Quantity = 1 } }
        };

        var (success, error, _, _) = await service.CheckoutAsync(request);

        Assert.False(success);
        Assert.Contains("seized", error);
    }

    [Fact]
    public async Task Checkout_WithInsufficientStock_ReturnsError()
    {
        var listing = MakeListing(1, 100m, 2);

        var orderRepo = new Mock<IOrderRepository>();
        var listingRepo = new Mock<IListingRepository>();
        listingRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(listing);
        var shopRepo = new Mock<IShopStateRepository>();

        var service = new OrderService(orderRepo.Object, listingRepo.Object, shopRepo.Object, new NoRaidRandom());

        var request = new CheckoutRequest
        {
            Items = new() { new CheckoutItemRequest { ListingId = 1, Quantity = 5 } }
        };

        var (success, error, _, _) = await service.CheckoutAsync(request);

        Assert.False(success);
        Assert.Contains("Not enough stock", error);
    }

    [Fact]
    public async Task Checkout_UnderDiscountThreshold_NoDiscountApplied()
    {
        var listing = MakeListing(1, 100m, 10);

        var orderRepo = new Mock<IOrderRepository>();
        orderRepo.Setup(r => r.CountAsync()).ReturnsAsync(5);
        orderRepo.Setup(r => r.CreateOrderAsync(It.IsAny<Order>(), It.IsAny<List<OrderItem>>()))
                 .ReturnsAsync(1);
        orderRepo.Setup(r => r.GetByIdAsync(1))
                 .ReturnsAsync(new Order { Id = 1, Status = "Completed", Subtotal = 100, Discount = 0, Total = 100 });
        orderRepo.Setup(r => r.GetItemsByOrderIdAsync(1)).ReturnsAsync(new List<OrderItem>());

        var listingRepo = new Mock<IListingRepository>();
        listingRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(listing);

        var shopRepo = new Mock<IShopStateRepository>();

        var service = new OrderService(orderRepo.Object, listingRepo.Object, shopRepo.Object, new NoRaidRandom());

        var request = new CheckoutRequest
        {
            Items = new() { new CheckoutItemRequest { ListingId = 1, Quantity = 1 } }
        };

        var (success, _, result, _) = await service.CheckoutAsync(request);

        Assert.True(success);
        Assert.False(result!.DiscountApplied);
        Assert.Equal(0m, result.DiscountAmount);
    }

    [Fact]
    public async Task Checkout_OverDiscountThreshold_Applies20Percent()
    {
        var listing = MakeListing(1, 100m, 10);

        var orderRepo = new Mock<IOrderRepository>();
        orderRepo.Setup(r => r.CountAsync()).ReturnsAsync(11);
        orderRepo.Setup(r => r.CreateOrderAsync(It.IsAny<Order>(), It.IsAny<List<OrderItem>>()))
                 .ReturnsAsync(1);
        orderRepo.Setup(r => r.GetByIdAsync(1))
                 .ReturnsAsync(new Order { Id = 1, Status = "Completed", Subtotal = 100, Discount = 20, Total = 80 });
        orderRepo.Setup(r => r.GetItemsByOrderIdAsync(1)).ReturnsAsync(new List<OrderItem>());

        var listingRepo = new Mock<IListingRepository>();
        listingRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(listing);

        var shopRepo = new Mock<IShopStateRepository>();

        var service = new OrderService(orderRepo.Object, listingRepo.Object, shopRepo.Object, new NoRaidRandom());

        var request = new CheckoutRequest
        {
            Items = new() { new CheckoutItemRequest { ListingId = 1, Quantity = 1 } }
        };

        var (success, _, result, _) = await service.CheckoutAsync(request);

        Assert.True(success);
        Assert.True(result!.DiscountApplied);
        Assert.Equal(20m, result.DiscountAmount);
    }

    [Fact]
    public async Task Checkout_WhenRaidFires_DeactivatesListings()
    {
        var listing = MakeListing(1, 100m, 10);

        var orderRepo = new Mock<IOrderRepository>();
        orderRepo.Setup(r => r.CountAsync()).ReturnsAsync(0);
        orderRepo.Setup(r => r.CreateOrderAsync(It.IsAny<Order>(), It.IsAny<List<OrderItem>>()))
                 .ReturnsAsync(1);
        orderRepo.Setup(r => r.GetByIdAsync(1))
                 .ReturnsAsync(new Order { Id = 1, Status = "Completed", Total = 100 });
        orderRepo.Setup(r => r.GetItemsByOrderIdAsync(1)).ReturnsAsync(new List<OrderItem>());

        var listingRepo = new Mock<IListingRepository>();
        listingRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(listing);

        var shopRepo = new Mock<IShopStateRepository>();

        var service = new OrderService(orderRepo.Object, listingRepo.Object, shopRepo.Object, new AlwaysRaidRandom());

        var request = new CheckoutRequest
        {
            Items = new() { new CheckoutItemRequest { ListingId = 1, Quantity = 1 } }
        };

        var (success, _, result, _) = await service.CheckoutAsync(request);

        Assert.True(success);
        Assert.True(result!.Raided);
        listingRepo.Verify(r => r.DeactivateAllAsync(), Times.Once);
        shopRepo.Verify(s => s.SetSeizedAsync(It.IsAny<string>()), Times.Once);
    }
}