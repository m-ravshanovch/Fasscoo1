"use client"
import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import * as XLSX from 'xlsx'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

interface ComingItem {
    id: number;
    name: string;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    sum: number;
    date: string;
}

export default function Home() {
    const [search, setSearch] = useState("")
    const [dateFilter, setDateFilter] = useState("")
    const [comingData, setComingData] = useState<ComingItem[]>([])

    useEffect(() => {
        axios.get("https://medicine-store.fassco.uz/api/v1/accounting/medicine-arrivals/?limit=100&offset=0")
            .then((res) => {
                if (res.data && res.data.results) {
                    const mappedData: ComingItem[] = res.data.results.map((item: any) => ({
                        id: item.id,
                        name: item.medicine_name,
                        quantity: item.quantity,
                        purchasePrice: parseFloat(item.unit_buy_price),  // Convert string to number
                        sellingPrice: parseFloat(item.unit_sell_price), // Convert string to number
                        sum: parseFloat(item.total_buy_price), // Convert string to number
                        date: new Date(item.arrival_date).toISOString().split("T")[0] // Convert to YYYY-MM-DD
                    }))
                    setComingData(mappedData)
                }
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])

    const filteredData = comingData.filter((item) => {
        const itemName = item.name || ""
        const matchesName = itemName.toLowerCase().includes(search.toLowerCase())
        
        const matchesDate = dateFilter
            ? new Date(item.date).toISOString().split("T")[0] === dateFilter
            : true;

        return matchesName && matchesDate
    })

    const totalSum = filteredData.reduce((acc, item) => acc + item.sum, 0)
    const totalSold = filteredData.reduce((acc, item) => acc + item.quantity, 0)

    const exportToExcel = () => {
        const exportData = filteredData.map(item => ({
            ID: item.id,
            Name: item.name,
            Quantity: item.quantity,
            Purchase_Price: item.purchasePrice,
            Selling_Price: item.sellingPrice,
            Sum: item.sum,
            Date: item.date,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Import Data");

        XLSX.writeFile(wb, "import_data.xlsx");
    };

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

            <div className="w-full grid grid-cols-2 gap-x-5 mt-4 px-5">
                <input
                    type="date"
                    onChange={e => setDateFilter(e.target.value)}
                    className="border-2 border-[#0D1633] rounded-md w-full py-1 text-center"
                />

                <button className="px-3 bg-[#0D1633] text-white rounded-md">
                    <Link href={'/pages/inventory/coming/comingAdd'} className="w-full text-xl py-1 block active:opacity-80">
                        добавить
                    </Link>
                </button>
            </div>

            <div className="w-full grid grid-cols-1 gap-x-5 mt-4 place-items-end px-5">
                <button
                    onClick={exportToExcel}  
                    className="rounded-lg bg-[#0D1633] text-white py-1 px-4 text-lg"
                >
                    <CloudDownloadIcon/>
                </button>
            </div>

            <div className="overflow-x-auto w-full max-w-full">
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
                        <tr className="border-2">
                            <th className=" px-4 py-2 text-left text-sm font-medium text-gray-500">ОБЩИЙ</th>
                            <th className=" px-4 py-2"></th>
                            <th className=" text-left px-4 py-2">{isNaN(totalSold) ? 0 : totalSold}</th>
                            <th className=" px-4 py-2"></th>
                            <th className=" px-4 py-2"></th>
                            <th className=" px-4 py-2 text-right">{isNaN(totalSum) ? 0 : totalSum} sum</th>
                            <th className=" px-4 py-2"></th>
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
