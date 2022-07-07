CREATE TABLE [dbo].[ApprovalRequestApproverOrViewer] (
    [Id]               UNIQUEIDENTIFIER NOT NULL,
    [ApprovalLevelId]  UNIQUEIDENTIFIER NOT NULL,
    [UserId]           UNIQUEIDENTIFIER NOT NULL,
    [Comment]          NVARCHAR (2000)  NULL,
    [ResponseDate]     DATETIME         NULL,
    [ApprovalStatusId] INT              NULL,
    [IsApprover]       BIT              NOT NULL,
    [GroupInfo]        NVARCHAR (1000)  NULL,
    [Created]          DATETIME         NOT NULL,
    CONSTRAINT [PK_RequestApproversOrViewers] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ApprovalRequestApproverOrViewer_ApprovalStatus] FOREIGN KEY ([ApprovalStatusId]) REFERENCES [dbo].[ApprovalStatus] ([Id]),
    CONSTRAINT [FK_ApprovalRequestApproverOrViewer_ApprovalSteps] FOREIGN KEY ([ApprovalLevelId]) REFERENCES [dbo].[ApprovalLevels] ([Id]),
    CONSTRAINT [FK_RequestApproversOrViewers_UserInfo] FOREIGN KEY ([UserId]) REFERENCES [dbo].[UserInfo] ([Id])
);

