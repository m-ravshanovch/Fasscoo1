"use client"
import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

// Updated interface to include an optional cost field.
interface productsItem {
    id: number | string,
    name: string,
    cost: number,          // This now represents the sale price in the table.
    sold: number,
    client: string,
    paymentType: string,
    date: string, // Optional field for the procurement price.
}

export default function Home() {
    const [search, setSearch] = useState("")
    const [dateFilter, setDateFilter] = useState("")
    const [goingData, setGoingData] = useState<productsItem[]>([])
    const [client, setClient] = useState("")
    const [suggestClient, setSuggestClient] = useState<{ name: string }[]>([])
    useEffect(() => {
        axios.get("http://172.20.10.2:5000/Export")
            .then((res) => {
                // Map the fields so that the procurement price (cost) is taken from "cost"
                // and sale price (cost) defaults to "sell" if available, otherwise fallback to "cost".
                const mappedData = res.data.map((item: productsItem) => ({
                    ...item,
                    cost: item.cost,
                }))
                setGoingData(mappedData)
                console.log(mappedData)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const filteredData = goingData.filter((item) => {
        const itemName = item.name || ""
        const clientName = item.client || ""
        const matchesName = itemName.toLowerCase().includes(search.toLowerCase())
        const clientFilter = clientName.toLowerCase().includes(client.toLowerCase())
        const itemDate = item.date || ""
        const matchesDate = dateFilter ? itemDate.includes(dateFilter) : true
        return matchesName && matchesDate && clientFilter
    })

    const totalSum = filteredData.reduce((acc, item) => acc + item.sold * item.cost, 0)
    const totalSold = filteredData.reduce((acc, item) => acc + item.sold, 0)


    useEffect(() => {
        axios.get("http://192.168.0.105:5000/Client").then((res) => {
            setSuggestClient(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    return (
        <div className="md:p-2 place-items-center w-full grid grid-cols-1 gap-y-3 py-5">
            <div className="w-full flex justify-end">
                <button className="px-3 rounded-lg text-xl active:opacity-80" title="Back">
                    <Link href={'/pages/inventory/'}>
                        <Image src={'/back-button.png'} width={32} height={32} alt="back-button" />
                    </Link>
                </button>
            </div>

            <div className="font-bold text-4xl text-center">
                продажа<br /> <span className="text-zinc-400 text-xl">список</span>
            </div>

            <div className="w-full flex justify-center">
                <input
                    type="text"
                    placeholder="Поиск"
                    onChange={e => setSearch(e.target.value)}
                    className="border-2 border-[#0D1633] rounded-md w-64 py-1 text-center"
                />
            </div>

            <div className="w-full grid grid-cols-2 place-items-center px-6 gap-x-5  mt-4">
                <input
                    type="text"
                    placeholder="Фильтр по дате"
                    onChange={e => setDateFilter(e.target.value)}
                    className="border-2 border-[#0D1633] rounded-md w-full py-1 text-center"
                />
                <input
                    type="text"
                    list="client"
                    placeholder="Фильтр по client"
                    onChange={e => setClient(e.target.value)}
                    className="border-2 border-[#0D1633] rounded-md w-full py-1 text-center"
                />
                <datalist id="client">
                    {suggestClient.map((res, i) => (
                        <option key={i} value={res.name}></option>
                    ))}
                </datalist>
            </div>
            <div className="w-full flex justify-end gap-x-5 mt-4 px-5">
                <button className="px-3 bg-[#0D1633] text-white rounded-md">
                    <Link href={'/pages/inventory/products/productsAdd'} className="text-xl py-1 block active:opacity-80">
                        добавить
                    </Link>
                </button>
            </div>
            <div className="overflow-x-auto w-full max-w-full">
                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Лек.</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Кол.</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Цена</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Сумма</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">клиент</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Типоплаты</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Дата</th>
                        </tr>
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ОБЩИЙ</th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 text-left py-2">{isNaN(totalSold) ? 0 : totalSold}</th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2 text-right">{isNaN(totalSum) ? 0 : totalSum} sum</th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((res) => (
                            <tr key={res.id}>
                                <td className="px-4 py-2 text-left text-sm text-gray-900">{res.id}</td>
                                <td className="px-4 py-2 text-left text-sm text-gray-900">{res.name}</td>
                                <td className="px-4 py-2 text-left text-sm text-gray-900">{res.sold}</td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">{res.cost} sum</td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">{res.cost * res.sold} sum</td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">{res.client}</td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">{res.paymentType}</td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">{res.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}