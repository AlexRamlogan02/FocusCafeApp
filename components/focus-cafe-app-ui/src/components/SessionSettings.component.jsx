import Dropdown from "./Dropdown.component";
import IncDec from "./IncDec.component";
import { useNavigate } from 'react-router-dom'
import React from 'react';

export default function SessionSettings({ item = {
    item: 'Default Item',
    assetLink: null,
} }) {
    const navigate = useNavigate();
    const presetOptions = [
        { value: '25 / 5', label: 'Preset 1' },
        { value: '50 / 10', label: 'Preset 2' },
        { value: '60 / 15', label: 'Preset 3' },
    ];

    const [focusDuration, setFocusDuration] = React.useState(25 * 60);
    const [breakDuration, setBreakDuration] = React.useState(5 * 60);
    const [numSessions, setNumSessions] = React.useState(4);
    const [selectedPreset, setSelectedPreset] = React.useState(presetOptions[0]);
    
    const onChangeFocus = (value) => {
        setFocusDuration(value);
    };

    const onSelectBreak = (value) => {
        setBreakDuration(value);
    };

    const onSelectSessions = (value) => {
        setNumSessions(value);
    };

    const handleStart = () => {
        navigate('/focus', {
            state: {
                item,
                settings: {
                    focusDuration,
                    breakDuration,
                    numSessions,
                },
            },
        });
    };

    return (
        <div className="space-y-4 rounded-2xl border border-[color:var(--secondary)]/20 bg-white p-6 shadow-sm dark:bg-slate-900/50">
            <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
                <div className="flex items-center justify-center rounded-2xl bg-[var(--milk)] p-4">
                    {item?.assetLink ? (
                        <img
                            src={item.assetLink}
                            alt={item.item || 'Selected item'}
                            className="h-48 w-full max-w-xs rounded-xl object-cover"
                        />
                    ) : (
                        <div className="text-sm text-[var(--text-color)]/70">No image selected</div>
                    )}
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">Session setup</p>
                        <h2 className="text-xl font-semibold text-[var(--text-color)]">{item?.item || 'Choose a menu item'}</h2>
                    </div>

                    <div className="space-y-2">
                        <h2>Presets</h2>
                        <Dropdown
                            options={presetOptions}
                            value={selectedPreset}
                            onChange={(option) => {
                                setSelectedPreset(option);
                                const [focusMinutes, breakMinutes] = option.value.split('/').map(v => parseInt(v.trim(), 10));
                                setFocusDuration(focusMinutes * 60);
                                setBreakDuration(breakMinutes * 60);
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <IncDec
                            label="Focus Duration (minutes)"
                            min={0}
                            jump={5}
                            initialValue={25}
                            value={focusDuration / 60}
                            onChange={(value) => onChangeFocus(value * 60)}
                        />
                        <IncDec
                            label="Break Duration (minutes)"
                            min={0}
                            jump={5}
                            initialValue={5}
                            value={breakDuration / 60}
                            onChange={(value) => onSelectBreak(value * 60)}
                        />
                        <IncDec
                            label="Number of Sessions"
                            min={1}
                            jump={1}
                            initialValue={4}
                            value={numSessions}
                            onChange={(value) => onSelectSessions(value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={handleStart}
                        > Get Started </button>
                    </div>
                </div>
            </div>
        </div>
    );
}