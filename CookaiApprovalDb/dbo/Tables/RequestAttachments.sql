CREATE TABLE [dbo].[RequestAttachments] (
    [Id]                UNIQUEIDENTIFIER NOT NULL,
    [BlobUrl]           NVARCHAR (1000)  NOT NULL,
    [FileName]          NVARCHAR (1000)  NOT NULL,
    [FileSize]          INT              NOT NULL,
    [FileUploadId]      UNIQUEIDENTIFIER NOT NULL,
    [ApprovalRequestId] UNIQUEIDENTIFIER NULL,
    [Created]           DATETIME         NOT NULL,
    [CreatedUserId]     UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK__RequestA__3214EC07503028F1] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_RequestAttachments_ApprovalRequests] FOREIGN KEY ([ApprovalRequestId]) REFERENCES [dbo].[ApprovalRequests] ([Id]),
    CONSTRAINT [FK_RequestAttachments_UserInfo] FOREIGN KEY ([CreatedUserId]) REFERENCES [dbo].[UserInfo] ([Id])
);

