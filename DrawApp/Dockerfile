FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["DrawApp/DrawApp.csproj", "DrawApp/"]
RUN dotnet restore "DrawApp/DrawApp.csproj"
COPY . .
WORKDIR "/src/DrawApp"
RUN dotnet build "DrawApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DrawApp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DrawApp.dll"]
