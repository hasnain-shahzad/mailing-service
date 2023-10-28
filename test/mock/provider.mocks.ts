export const LoggerMock = {
    log: jest.fn((value: string) => {
        return;
    }),
    error: jest.fn((value: string) => {
        return;
    }),
    setContext: jest.fn((value: string) => {
        return;
    }),
    debug: jest.fn(() => {
        return;
    }),
};

export const MailingQueueMock = {
    add: jest.fn(() => {
        return;
    }),
    process: jest.fn(() => {
        return;
    }),
};

export const MailerMock = {
    sendEmail: jest.fn(() => {
        return;
    })
};