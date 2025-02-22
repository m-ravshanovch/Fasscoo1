'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface MedicineObject {
    items: string[];
}

export default function MedicinesPage() {
    const [medicineName, setMedicineName] = useState("");
    const [medicines, setMedicines] = useState<MedicineObject>({ items: [] });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem("myMedicines");
            if (data) {
                setMedicines(JSON.parse(data));
            }
        }
    }, []);
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("myMedicines", JSON.stringify(medicines));
        }
    }, [medicines]);

    const handleAdd = () => {
        if (medicineName.trim()) {
            setMedicines((prev) => ({
                ...prev,
                items: [...prev.items, medicineName.trim()],
            }));
            setMedicineName("");
        }
    };

    const handleRemove = (index: number) => {
        setMedicines((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setMedicineName(medicines.items[index]);
    };

    const handleUpdate = () => {
        if (editingIndex !== null && medicineName.trim()) {
            setMedicines((prev) => {
                const updatedItems = [...prev.items];
                updatedItems[editingIndex] = medicineName.trim();
                return { ...prev, items: updatedItems };
            });
            setMedicineName("");
            setEditingIndex(null);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-screen h-[80vh] p-6">
            <div className="absolute top-4 right-4">
                <Link href="/pages/inventory/inventoryPlus/">
                    <Image src="/back-button.png" width={32} height={32} alt="back-button"></Image>
                </Link>
            </div>
            <h1 className="text-2xl font-bold mb-4">Добавить лекарство</h1>

            <div className="flex flex-col justify-center items-end space-y-2 mb-4">
                <input
                    type="text"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    className="border-[#0D1633] border-2 rounded-lg text-xl w-full p-2 font-semibold"
                    placeholder="Введите название..."
                />
                {editingIndex === null ? (
                    <button
                        onClick={handleAdd}
                        className="border-[#0D1633] bg-[#0D1633] border-2 rounded-lg text-white text-sm w-1/3"
                    >
                        добавить
                    </button>
                ) : (
                    <button
                        onClick={handleUpdate}
                        className="border-[#0D1633] bg-[#0D1633] border-2 rounded-lg text-white text-sm w-1/3"
                    >
                        обновить
                    </button>
                )}
            </div>

            <p className="mb-2">Количество лекарств: {medicines.items.length}</p>

            <ul className="list-decimal list-inside w-full max-w-md">
                {medicines.items.map((item, index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded"
                    >
                        <span className="mr-4 text-xl font-semibold">{item}</span>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleEdit(index)}
                            >
                                <Image src="/edit.png" width={32} height={32} alt="edit"></Image>
                            </button>
                            <button
                                onClick={() => handleRemove(index)}
                            >
                                <Image src="/delete.png" width={32} height={32} alt="delete"></Image>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
