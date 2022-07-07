CREATE TABLE [dbo].[ApprovalRequests] (
    [Id]                      UNIQUEIDENTIFIER NOT NULL,
    [ParentApprovalRequestId] UNIQUEIDENTIFIER NULL,
    [Title]                   NVARCHAR (1000)  NOT NULL,
    [Details]                 NVARCHAR (1000)  NOT NULL,
    [ResponseDate]            DATETIME         NULL,
    [ApprovalStatusId]        INT              NULL,
    [RequestedDate]           DATETIME         NULL,
    [RequesterUserId]         UNIQUEIDENTIFIER NOT NULL,
    [AttachementUrl]          NVARCHAR (1000)  NULL,
    [Created]                 DATETIME         NOT NULL,
    [Modified]                DATETIME         NULL,
    [TenantInfoId]            BIGINT           NOT NULL,
    [TotalLevel]              INT              NULL,
    [CurrentLevel]            INT              NULL,
    [TemplateId]              UNIQUEIDENTIFIER NULL,
    [DesiredCompletionDate]   DATETIME         NULL,
    CONSTRAINT [PK_ApprovalRequests] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ApprovalRequests_ApprovalStatus] FOREIGN KEY ([ApprovalStatusId]) REFERENCES [dbo].[ApprovalStatus] ([Id]),
    CONSTRAINT [FK_ApprovalRequests_Templates] FOREIGN KEY ([TemplateId]) REFERENCES [dbo].[Templates] ([Id]),
    CONSTRAINT [FK_ApprovalRequests_TenantInfo] FOREIGN KEY ([TenantInfoId]) REFERENCES [dbo].[TenantInfo] ([Id]),
    CONSTRAINT [FK_ApprovalRequests_UserInfo] FOREIGN KEY ([RequesterUserId]) REFERENCES [dbo].[UserInfo] ([Id])
);



