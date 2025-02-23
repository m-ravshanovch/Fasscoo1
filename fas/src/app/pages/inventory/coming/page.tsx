"use client"
import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

interface ComingItem {
    id: number | string,
    name: string,
    quantity: number,
    purchasePrice: number,
    sellingPrice: number,
    sum: number,
    cost: number,
    sell: number,
    date: string
}

export default function Home() {
    const [search, setSearch] = useState("")
    const [dateFilter, setDateFilter] = useState("")
    const [comingData, setComingData] = useState<ComingItem[]>([])

    useEffect(() => {
        axios.get("http://172.20.10.2:5000/Import")
            .then((res) => {
                // map the fields so that cost => purchasePrice and sell => sellingPrice
                const mappedData = res.data.map((item: ComingItem) => ({
                    ...item,
                    purchasePrice: item.cost,
                    sellingPrice: item.sell
                }))
                setComingData(mappedData)   
                console.log(mappedData)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const filteredData = comingData.filter((item) => {
        const itemName = item.name || ""
        const matchesName = itemName.toLowerCase().includes(search.toLowerCase())
        const itemDate = item.date || ""
        const matchesDate = dateFilter ? itemDate.includes(dateFilter) : true
        return matchesName && matchesDate
    })

    const totalSum = filteredData.reduce((acc, item) => acc + item.sum, 0)
    const totalSold = filteredData.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <div className="md:p-2 place-items-center w-full grid grid-cols-1 gap-y-3 py-5">
            <div className="w-full flex justify-end">
                <button className="px-3 rounded-lg text-xl active:opacity-80">
                    <Link href={'/pages/inventory/'}>
                        <Image src={'/back-button.png'} width={32} height={32} alt="back-button" />
                    </Link>
                </button>
            </div>

            <div className="font-bold text-4xl text-center">
                приход товаров<br /> <span className="text-zinc-400 text-xl">список</span>
            </div>

            <div className="w-full flex justify-center">
                <input
                    type="text"
                    placeholder="Поиск"
                    onChange={e => setSearch(e.target.value)}
                    className="border-2 border-[#0D1633] rounded-md w-64 py-1 text-center"
                />
            </div>

            <div className="w-full flex justify-center gap-x-5 mt-4">
                <input
                    type="text" 
                    placeholder="Фильтр по дате"
                    onChange={e => setDateFilter(e.target.value)}
                    className="border-2 border-[#0D1633] rounded-md w-64 py-1 text-center"
                />

                <button className="px-3 bg-[#0D1633] text-white rounded-md">
                    <Link href={'/pages/inventory/coming/comingAdd'} className="w-44 text-xl py-1 block active:opacity-80">
                        добавить
                    </Link>
                </button>
            </div>

            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Лек.</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Кол.</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Закуп. Цена</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Прод. Цена</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Сумма</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Дата</th>
                        </tr>
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ОБЩИЙ</th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2">{isNaN(totalSold) ? 0 : totalSold}</th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2 text-right">{isNaN(totalSum) ? 0 : totalSum} sum</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((res) => (
                            <tr key={res.id}>
                                <td className="px-4 py-2 text-left text-sm text-gray-900">{res.id}</td>
                                <td className="px-4 py-2 text-left text-sm text-gray-900">{res.name}</td>
                                <td className="px-4 py-2 text-left text-sm text-gray-900">{res.quantity}</td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">{res.purchasePrice}</td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">{res.sellingPrice}</td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">{res.sum} sum</td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">{res.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}