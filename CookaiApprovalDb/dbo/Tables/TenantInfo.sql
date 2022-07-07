CREATE TABLE [dbo].[TenantInfo] (
    [Id]                BIGINT           IDENTITY (1, 1) NOT NULL,
    [TenantId]          UNIQUEIDENTIFIER NOT NULL,
    [GivenAdminconsent] BIT              NULL,
    [BotServiceUrl]     NVARCHAR (1000)  NULL,
    [Created]           DATETIME         NOT NULL,
    CONSTRAINT [PK_TenantInfo] PRIMARY KEY CLUSTERED ([Id] ASC)
);

