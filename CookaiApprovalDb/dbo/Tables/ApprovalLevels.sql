CREATE TABLE [dbo].[ApprovalLevels] (
    [Id]                UNIQUEIDENTIFIER CONSTRAINT [DF_ApprovalSteps_Id] DEFAULT (newid()) NOT NULL,
    [LevelName]         NVARCHAR (250)   NULL,
    [LevelNo]           INT              NOT NULL,
    [IsSingleApprover]  BIT              NOT NULL,
    [ResponseDate]      DATETIME         NULL,
    [ApprovalStatusId]  INT              NULL,
    [ApprovalRequestId] UNIQUEIDENTIFIER NOT NULL,
    [Created]           DATETIME         NOT NULL,
    [IsApproveOnly]     BIT              NOT NULL,
    CONSTRAINT [PK_ApprovalSteps] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ApprovalSteps_ApprovalRequests] FOREIGN KEY ([ApprovalRequestId]) REFERENCES [dbo].[ApprovalRequests] ([Id]),
    CONSTRAINT [FK_ApprovalSteps_ApprovalStatus] FOREIGN KEY ([ApprovalStatusId]) REFERENCES [dbo].[ApprovalStatus] ([Id])
);

