"use client"
import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function Home() {
    const [search, setSearch] = useState("")
    const [dateFilter, setDateFilter] = useState("")
    const [importData, setImportData] = useState<{
        id: number,
        name: string,
        cost: number,
        paymentType: string,
        client: string,
        sold: number,
        date: string
    }[]>([])

    useEffect(() => {
        axios.get("http://172.18.0.55:5000/Export/")
            .then((res) => {
                setImportData(res.data)
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const filteredData = importData.filter((item) => {
        const matchesName = item.name.toLowerCase().includes(search.toLowerCase())
        const matchesClient = item.client.toLowerCase().includes(search.toLowerCase())
        const matchesDate = item.date.toLowerCase().includes(dateFilter.toLowerCase())
        return (matchesName || matchesClient) && matchesDate
    })
    const totalSum = filteredData.reduce((acc, item) => acc + item.cost * item.sold, 0)
    const totalSold = filteredData.reduce((acc, item) => acc + item.sold, 0)

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
                продажа<br /> <span className="text-zinc-400 text-xl">список</span>
            </div>

            <div className="w-full flex justify-center">
                <input
                    type="text"
                    placeholder="Поиск (лек. или клиент)"
                    onChange={e => setSearch(e.target.value)}
                    className="border-2 border-[#0D1633] border-solid rounded-md w-64 py-1 text-center"
                />
            </div>

            <div className="w-full place-items-center">
                <div className="flex gap-x-5 justify-center mt-4">
                    <input
                        type="text"
                        placeholder="Фильтр по дате"
                        onChange={e => setDateFilter(e.target.value)}
                        className="border-2 border-[#0D1633] border-solid rounded-md w-64 py-1 text-center"
                    />

                    <button className="px-3 bg-[#0D1633] text-white rounded-md">
                        <Link href={'/pages/inventory/coming/comingAdd'} className="w-44 text-xl py-1 block active:opacity-80">
                            добавить
                        </Link>
                    </button>
                </div>
            </div>

            <div className="w-full overflow-scroll ">
                <table className="w-full border-2 place-items-center">
                    <thead >
                        <tr className="border-2 ">
                            <th className="text-left border-2">ID</th>
                            <th className="text-left border-2">Лек.</th>
                            <th>кол.</th>
                            <th className="text-right border-2">цена</th>
                            <th className="text-right border-2">сумма</th>
                            <th className="text-right border-2">клиент</th>
                            <th className="text-right border-2">Типоплаты</th>
                            <th className="text-right border-2">дата</th>
                        </tr>
                        <tr  >
                            <th className="text-left border-2">ОБЩИЙ</th>
                            <th className="text-left"></th>
                            <th className="border-2">{totalSold}</th>
                            <th className="text-right border-2"></th>
                            <th className="text-right border-2">{totalSum} sum</th>
                            <th className="text-right border-2"></th>
                            <th className="text-right border-2"></th>
                            <th className="text-right border-2"></th>
                        </tr>
                    </thead>
                    <tbody className="border-2">
                        {filteredData.map((res) => (
                            <tr key={res.id} >
                                <td className="border-2">{res.id}</td>
                                <td className="border-2">{res.name}</td>
                                <td className="border-2 text-center">{res.sold}</td>
                                <td className="border-2 text-right">{res.cost}</td>
                                <td className="border-2 text-right">{res.cost * res.sold} sum</td>
                                <td className="border-2 text-right">{res.client}</td>
                                <td className="border-2  text-center md:text-right">{res.paymentType}</td>
                                <td className="border-2 text-right">{res.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}