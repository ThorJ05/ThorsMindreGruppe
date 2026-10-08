namespace Infrastructure;

public interface IRandomProvider
{
    double NextDouble();
}

public class SystemRandomProvider : IRandomProvider
{
    public double NextDouble() => Random.Shared.NextDouble();
}