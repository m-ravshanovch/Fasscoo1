'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

interface ProductItem {
    id: number | string;
    name: string;
    cost: number;
    sold: number;
    sum: number;
    client: string;
    paymentType: string;
    date: string;
}

export default function MedicinesPage() {
    const router = useRouter();
    const [medicineName, setMedicineName] = useState("");
    const [sold, setSold] = useState<number>(0);
    const [cost, setCost] = useState<number>(0);
    const [sum, setSum] = useState<number>(0);
    const [client, setClient] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [ProductItems, setProductItems] = useState<ProductItem[]>([]);
    const [editingId, setEditingId] = useState<number | string | null>(null);

    useEffect(() => {
        axios.get("http://172.18.0.55:5000/ExportHolder")
            .then((response) => {
                // Assuming the API returns keys according to the ProductItem interface
                setProductItems(response.data);
            })
            .catch((err) => console.error("Error fetching ExportHolder items:", err));
    }, []);

    const handleAdd = () => {
        if (medicineName.trim()) {
            const newItem = {
                name: medicineName.trim(),
                cost,
                sold,
                sum,
                client,
                paymentType,
                date,
            };

            axios.post("http://172.18.0.55:5000/ExportHolder", newItem)
                .then((response) => {
                    setProductItems((prev) => [response.data, ...prev]);
                    // Reset inputs
                    setMedicineName("");
                    setSold(0);
                    setCost(0);
                    setSum(0);
                    setClient("");
                    setPaymentType("");
                    setDate(new Date().toISOString().split("T")[0]);
                })
                .catch((err) => console.error("Error adding item:", err));
        }
    };

    const handleRemove = (id: number | string) => {
        axios.delete(`http://172.18.0.55:5000/ExportHolder/${id}`)
            .then(() => {
                setProductItems((prev) => prev.filter((item) => item.id !== id));
            })
            .catch((err) => console.error("Error removing item:", err));
    };

    const handleEdit = (item: ProductItem) => {
        setEditingId(item.id);
        setMedicineName(item.name);
        setCost(item.cost);
        setSold(item.sold);
        setSum(item.sum);
        setClient(item.client);
        setPaymentType(item.paymentType);
        setDate(item.date);
    };

    const handleUpdate = () => {
        if (editingId !== null && medicineName.trim()) {
            const originalItem = ProductItems.find((item) => item.id === editingId);
            if (!originalItem) return;
            const updatedItem = {
                ...originalItem,
                name: medicineName.trim(),
                cost,
                sold,
                sum,
                client,
                paymentType,
                date,
            };

            axios.put(`http://172.18.0.55:5000/ExportHolder/${editingId}`, updatedItem)
                .then((response) => {
                    setProductItems((prev) =>
                        prev.map((item) => (item.id === editingId ? response.data : item))
                    );
                    // Reset inputs
                    setMedicineName("");
                    setCost(0);
                    setSold(0);
                    setSum(0);
                    setClient("");
                    setPaymentType("");
                    setDate(new Date().toISOString().split("T")[0]);
                    setEditingId(null);
                })
                .catch((err) => console.error("Error updating item:", err));
        }
    };

    const handleSaveAll = async () => {
        try {
            await Promise.all(ProductItems.map(async (item) => {
                const formattedItem = {
                    name: item.name,
                    cost: item.cost,
                    sold: item.sold,
                    sum: item.sum,
                    client: item.client,
                    paymentType: item.paymentType,
                    date: item.date
                };
                await axios.post("http://172.18.0.55:5000/Export", formattedItem);
                await axios.delete(`http://172.18.0.55:5000/ExportHolder/${item.id}`);
            }));
            router.push("/pages/inventory/coming");
        } catch (err) {
            console.error("Ошибка при сохранении товаров", err);
            alert("Ошибка при сохранении товаров");
        }
    };

    return (
        <div className="flex flex-col items-center w-screen p-6">
            <div className="absolute top-4 right-4">
                <Link href="/pages/inventory/coming/">
                    <Image
                        src="/back-button.png"
                        width={32}
                        height={32}
                        alt="back-button"
                    />
                </Link>
            </div>
            <h1 className="text-2xl font-bold mb-4">Добавить лекарство</h1>

            <div className="flex flex-col max-w-md justify-center items-center gap-8">
                <div className="flex justify-center items-start gap-4 w-full">
                    <div className="flex flex-col justify-center items-start gap-4 w-full">
                        <input
                            type="text"
                            onChange={(e) => setMedicineName(e.target.value)}
                            className="border-2 w-40 border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            placeholder="Введите название..."
                        />
                        <input
                            type="number"
                            onChange={(e) =>
                                setCost(e.target.valueAsNumber)
                            }
                            className="border-2 w-40 border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            placeholder="Введите закупочную цену..."
                        />
                        <input
                            type="number"
                            onChange={(e) =>
                                setSold(e.target.valueAsNumber)
                            }
                            className="border-2 w-40 border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            placeholder="Введите количество проданного..."
                        />
                        <input
                            type="number"
                            onChange={(e) =>
                                setSum(e.target.valueAsNumber)
                            }
                            className="border-2 w-40 border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            placeholder="Введите сумму..."
                        />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-4 w-full">
                        <input
                            type="text"
                            onChange={(e) => setClient(e.target.value)}
                            className="border-2 w-40 border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            placeholder="Введите клиента..."
                        />
                        <input
                            type="text"
                            onChange={(e) => setPaymentType(e.target.value)}
                            className="border-2 w-40 border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            placeholder="Введите тип оплаты..."
                        />
                        <input
                            type="text"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border-2 w-40 border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            placeholder="yyyy-mm-dd"
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-center items-end gap-4 w-full">
                    {editingId === null ? (
                        <button
                            onClick={handleAdd}
                            className="border-2 border-[#0D1633] bg-[#0D1633] rounded-lg text-white text-sm lg:text-xl p-1"
                        >
                            добавить
                        </button>
                    ) : (
                        <button
                            onClick={handleUpdate}
                            className="border-2 border-[#0D1633] bg-[#0D1633] rounded-lg text-white text-sm lg:text-xl p-1"
                        >
                            обновить
                        </button>
                    )}
                </div>
            </div>

            <p className="mb-2">Количество лекарств: {ProductItems.length}</p>

            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Название</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Закуп. Цена</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Количество</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Сумма</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Клиент</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Тип оплаты</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Дата</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ProductItems.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.cost}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.sold}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.sum}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.client}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.paymentType}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                    <button onClick={() => handleEdit(item)} className="mr-2" title="Edit item">
                                        <Image
                                            src="/edit.png"
                                            width={24}
                                            height={24}
                                            alt="edit"
                                        />
                                    </button>
                                    <button onClick={() => handleRemove(item.id)} title="Delete item">
                                        <Image
                                            src="/delete.png"
                                            width={24}
                                            height={24}
                                            alt="delete"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 w-full flex justify-end items-center">
                <button
                    onClick={handleSaveAll}
                    className="border-2 border-[#0D1633] bg-[#0D1633] rounded-lg text-white text-sm lg:text-xl p-1">
                    сохранить
                </button>
            </div>
        </div>
    );
}