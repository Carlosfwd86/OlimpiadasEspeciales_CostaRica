import React, { useEffect, useState } from 'react';
import '../styles/DatePickerInput.css';

interface DatePickerInputProps {
    value?: string;
    name?: string;
    id?: string;
    onChange?: (e: { target: { name: string; value: string; id?: string } }) => void;
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
    style?: React.CSSProperties;
    hasError?: boolean;
    required?: boolean;
}

const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const diasEnMes = (mes: number, anio: number): number => {
    if (mes === 0) return 31;
    return new Date(anio || 2000, mes, 0).getDate();
};

const parseValue = (v: string) => {
    if (!v) return { dd: '', mm: '', yyyy: '' };
    const parts = v.split('-');
    return { yyyy: parts[0] || '', mm: parts[1] || '', dd: parts[2] || '' };
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 120 }, (_, i) => currentYear - i);

const DatePickerInput = ({
    value = '',
    name = '',
    id,
    onChange,
    disabled = false,
    readOnly = false,
    className = '',
    style,
    hasError = false,
    required = false,
}: DatePickerInputProps) => {
    const initial = parseValue(value);
    const [dd, setDd] = useState(initial.dd);
    const [mm, setMm] = useState(initial.mm);
    const [yyyy, setYyyy] = useState(initial.yyyy);

    useEffect(() => {
        const parsed = parseValue(value);
        setDd(parsed.dd);
        setMm(parsed.mm);
        setYyyy(parsed.yyyy);
    }, [value]);

    const emit = (newDd: string, newMm: string, newYyyy: string) => {
        if (!onChange) return;
        if (newYyyy && newMm && newDd) {
            const formatted = `${newYyyy}-${newMm.padStart(2, '0')}-${newDd.padStart(2, '0')}`;
            onChange({ target: { name, id, value: formatted } });
        } else {
            onChange({ target: { name, id, value: '' } });
        }
    };

    const handleDd = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value;
        setDd(v);
        emit(v, mm, yyyy);
    };

    const handleMm = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value;
        // Recalculate day clamp if necessary
        const numDias = diasEnMes(parseInt(v), parseInt(yyyy));
        const clampedDd = dd && parseInt(dd) > numDias ? String(numDias) : dd;
        if (clampedDd !== dd) setDd(clampedDd);
        setMm(v);
        emit(clampedDd, v, yyyy);
    };

    const handleYyyy = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value;
        setYyyy(v);
        emit(dd, mm, v);
    };

    const parsedMm = parseInt(mm);
    const parsedYyyy = parseInt(yyyy);
    const numDias = isNaN(parsedMm) ? 31 : diasEnMes(parsedMm, isNaN(parsedYyyy) ? 2000 : parsedYyyy);
    const days = Array.from({ length: numDias }, (_, i) => i + 1);

    const isInteractive = !disabled && !readOnly;

    const containerClass = [
        'dpi-container',
        hasError ? 'dpi-error' : '',
        disabled ? 'dpi-disabled' : '',
        readOnly ? 'dpi-readonly' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div
            className={containerClass}
            style={style}
            id={id}
            role="group"
            aria-label="Selector de fecha"
        >
            {/* Día */}
            <div className="dpi-select-wrapper">
                <select
                    className="dpi-select"
                    value={dd}
                    onChange={handleDd}
                    disabled={!isInteractive}
                    required={required}
                    aria-label="Día"
                >
                    <option value="">Día</option>
                    {days.map(d => (
                        <option key={d} value={String(d).padStart(2, '0')}>
                            {d}
                        </option>
                    ))}
                </select>
                <span className="dpi-chevron">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>

            {/* Mes */}
            <div className="dpi-select-wrapper">
                <select
                    className="dpi-select"
                    value={mm}
                    onChange={handleMm}
                    disabled={!isInteractive}
                    aria-label="Mes"
                >
                    <option value="">Mes</option>
                    {MESES.map((mes, i) => (
                        <option key={mes} value={String(i + 1).padStart(2, '0')}>
                            {mes}
                        </option>
                    ))}
                </select>
                <span className="dpi-chevron">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>

            {/* Año */}
            <div className="dpi-select-wrapper">
                <select
                    className="dpi-select"
                    value={yyyy}
                    onChange={handleYyyy}
                    disabled={!isInteractive}
                    aria-label="Año"
                >
                    <option value="">Año</option>
                    {years.map(y => (
                        <option key={y} value={String(y)}>
                            {y}
                        </option>
                    ))}
                </select>
                <span className="dpi-chevron">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default DatePickerInput;
