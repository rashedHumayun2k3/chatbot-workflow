CREATE TABLE [dbo].[RequestRemarks] (
    [Id]                UNIQUEIDENTIFIER NOT NULL,
    [ApprovalRequestId] UNIQUEIDENTIFIER NOT NULL,
    [Remark]            NVARCHAR (2000)  NOT NULL,
    [Created]           DATETIME         CONSTRAINT [DF_RequestRemarks_Created] DEFAULT (getdate()) NOT NULL,
    [CreatedUserId]     UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_RequestRemarks] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_RequestRemarks_ApprovalRequests] FOREIGN KEY ([ApprovalRequestId]) REFERENCES [dbo].[ApprovalRequests] ([Id]),
    CONSTRAINT [FK_RequestRemarks_UserInfo] FOREIGN KEY ([CreatedUserId]) REFERENCES [dbo].[UserInfo] ([Id])
);

