CREATE TABLE [dbo].[UserInfo] (
    [Id]                UNIQUEIDENTIFIER NOT NULL,
    [UserPrincipalName] NVARCHAR (500)   NOT NULL,
    [TeamUserId]        NVARCHAR (500)   NULL,
    [AadObjectId]       UNIQUEIDENTIFIER NOT NULL,
    [TenantId]          BIGINT           NOT NULL,
    [Name]              NVARCHAR (500)   NULL,
    [ConversationId]    NVARCHAR (500)   NULL,
    [Created]           DATETIME         NOT NULL,
    CONSTRAINT [PK_UserInfo] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserInfo_TenantInfo] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[TenantInfo] ([Id])
);

