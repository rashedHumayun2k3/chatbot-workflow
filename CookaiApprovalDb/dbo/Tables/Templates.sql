CREATE TABLE [dbo].[Templates] (
    [Id]           UNIQUEIDENTIFIER NOT NULL,
    [Name]         NVARCHAR (500)   NOT NULL,
    [Body]         NVARCHAR (2000)  NULL,
    [TenantInfoId] BIGINT           NOT NULL,
    [Created]      DATETIME         NOT NULL,
    [IsActive]     BIT              NOT NULL,
    CONSTRAINT [PK_Templates] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Templates_TenantInfo] FOREIGN KEY ([TenantInfoId]) REFERENCES [dbo].[TenantInfo] ([Id])
);



