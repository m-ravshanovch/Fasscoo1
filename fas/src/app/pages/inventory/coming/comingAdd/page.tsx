'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

interface ComingItem {
    id: number | string;
    name: string;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    sum: number;
    date: string;
}

export default function MedicinesPage() {
    const router = useRouter();
    const [medicineName, setMedicineName] = useState("");
    const [quantity, setQuantity] = useState<number>(0);
    const [purchasePrice, setPurchasePrice] = useState<number>(0);
    const [sellingPrice, setSellingPrice] = useState<number>(0);
    const [sum, setSum] = useState<number>(0);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [comingItems, setComingItems] = useState<ComingItem[]>([]);
    const [editingId, setEditingId] = useState<number | string | null>(null);

    useEffect(() => {
        axios.get("http://172.18.0.55:5000/ImportHolder")
            .then((response) => {
                const items = response.data.map((item: any) => ({
                    ...item,
                    purchasePrice: item.cost,
                    sellingPrice: item.sell,
                }));
                setComingItems(items);
            })
            .catch((err) => console.error("Error fetching ImportHolder items:", err));
    }, []);

    const handleAdd = () => {
        if (medicineName.trim()) {
            const newItem = {
                name: medicineName.trim(),
                quantity, // already a number
                cost: purchasePrice,
                sell: sellingPrice,
                sum,
                date,
            };

            axios.post("http://172.18.0.55:5000/ImportHolder", newItem)
                .then((response) => {
                    const responseItem = {
                        ...response.data,
                        purchasePrice: response.data.cost,
                        sellingPrice: response.data.sell,
                    };
                    setComingItems((prev) => [responseItem, ...prev]);
                    // Reset inputs
                    setMedicineName("");
                    setQuantity(0);
                    setPurchasePrice(0);
                    setSellingPrice(0);
                    setSum(0);
                    setDate(new Date().toISOString().split("T")[0]);
                })
                .catch((err) => console.error("Error adding item:", err));
        }
    };

    const handleRemove = (id: number | string) => {
        axios.delete(`http://172.18.0.55:5000/ImportHolder/${id}`)
            .then(() => {
                setComingItems((prev) => prev.filter((item) => item.id !== id));
            })
            .catch((err) => console.error("Error removing item:", err));
    };

    const handleEdit = (item: ComingItem) => {
        setEditingId(item.id);
        setMedicineName(item.name);
        setQuantity(item.quantity);
        setPurchasePrice(item.purchasePrice);
        setSellingPrice(item.sellingPrice);
        setSum(item.sum);
        setDate(item.date);
    };

    const handleUpdate = () => {
        if (editingId !== null && medicineName.trim()) {
            const originalItem = comingItems.find((item) => item.id === editingId);
            if (!originalItem) return;
            const updatedItem = {
                ...originalItem,
                name: medicineName.trim(),
                quantity,
                cost: purchasePrice,
                sell: sellingPrice,
                sum,
                date
            };

            axios.put(`http://172.18.0.55:5000/ImportHolder/${editingId}`, updatedItem)
                .then((response) => {
                    const responseItem = {
                        ...response.data,
                        purchasePrice: response.data.cost,
                        sellingPrice: response.data.sell,
                    };
                    setComingItems((prev) =>
                        prev.map((item) => (item.id === editingId ? responseItem : item))
                    );
                    // Reset inputs
                    setMedicineName("");
                    setQuantity(0);
                    setPurchasePrice(0);
                    setSellingPrice(0);
                    setSum(0);
                    setDate(new Date().toISOString().split("T")[0]);
                    setEditingId(null);
                })
                .catch((err) => console.error("Error updating item:", err));
        }
    };

    const handleSaveAll = async () => {
        try {
            await Promise.all(comingItems.map(async (item) => {
                const formattedItem = {
                    name: item.name,
                    quantity: item.quantity,
                    cost: item.purchasePrice,
                    sell: item.sellingPrice,
                    sum: item.sum,
                    date: item.date
                };
                await axios.post("http://172.18.0.55:5000/Import", formattedItem);
                await axios.delete(`http://172.18.0.55:5000/ImportHolder/${item.id}`);
            }));
            router.push("/pages/inventory/coming");
        } catch (err) {
            console.error("Ошибка при сохранении товаров", err);
            alert("Ошибка при сохранении товаров");
        }
    };

    return (
        <div className="flex flex-col items-center w-full p-6 mt-8">
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
                                setQuantity(e.target.value === "" ? 0 : e.target.valueAsNumber)
                            }
                            className="border-2 w-40 border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            placeholder="Введите количество..."
                        />
                        <input
                            type="number"
                            onChange={(e) =>
                                setPurchasePrice(e.target.value === "" ? 0 : e.target.valueAsNumber)
                            }
                            className="border-2 w-40 border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            placeholder="Введите закупочную цену..."
                        />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-4 w-full">
                        <input
                            type="number"
                            onChange={(e) =>
                                setSellingPrice(e.target.value === "" ? 0 : e.target.valueAsNumber)
                            }
                            className="border-2 w-40 border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            placeholder="Введите продажную цену..."
                        />
                        <input
                            type="number"
                            onChange={(e) =>
                                setSum(e.target.value === "" ? 0 : e.target.valueAsNumber)
                            }
                            className="border-2 w-40 border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            placeholder="Введите сумму..."
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

            <p className="mb-2">Количество лекарств: {comingItems.length}</p>

            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Название</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Количество</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Закуп. Цена</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Прод. Цена</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Сумма</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Дата</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {comingItems.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.purchasePrice}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.sellingPrice}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.sum}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                    <button onClick={() => handleEdit(item)} className="mr-2" title="Редактировать">
                                        <Image
                                            src="/edit.png"
                                            width={24}
                                            height={24}
                                            alt="edit"
                                        />
                                    </button>
                                    <button onClick={() => handleRemove(item.id)} title="Удалить">
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