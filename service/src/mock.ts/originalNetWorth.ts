import { NetWorthDto } from "src/model/networth.dto"

export const CashAsset = [
    {
      category: 'Chequeing',
      cost: 2000.00
    },
    {
        category: 'Savings for Taxes',
        cost: 4000.00
    },
    {
        category: 'Raining Day Fund',
        cost: 506.00
    },
    {
        category: 'Savings for Fun',
        cost: 5000.00
    },
    {
        category: 'Savings for Travel',
        cost: 400.00
    },
    {
        category: 'Savings for Personal Development',
        cost: 200.00
    },
    {
        category: 'Investment1',
        cost: 5000.00
    },
    {
        category: 'Investment2',
        cost: 60000.00
    },
    {
        category: 'Investment3',
        cost: 24000.00
    },
]

export const LongtermAssets = [
    {
        category: 'Primary Home',
        cost: 455000.00
    },
    {
        category: 'Second Home',
        cost: 1564321.00
    },
]

export const ShortTermLiabilities = [
    {
        category: 'Credit Card 1',
        monthly: 200.00,
        cost: 5000.00
    },
    {
        category: 'Credit Card 2',
        monthly: 155.00,
        cost: 322.01
    },
]

export const LongTermLiabilities = [
    {
        category: 'Mortgage 1',
        monthly: 2000.00,
        cost: 250999.2343
    },
    {
        category: 'Mortgage 2',
        monthly: 3500.00,
        cost: 632634.02
    },
    {
        category: 'Line of Credit',
        monthly: 500.42,
        cost: 10000.32
    },
    {
        category: 'Investment Loan',
        monthly: 700.1010,
        cost: 10000.23
    },
]

export const DefaultNetWorthDto: NetWorthDto = {
    selectedCurrency: 'USD',
    cashAssets: CashAsset,
    longTermAssets: LongtermAssets,
    shortTermLiabilities: ShortTermLiabilities,
    longTermDebt: LongTermLiabilities
}