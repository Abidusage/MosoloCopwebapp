import React, { useState, useEffect } from 'react';
import {
    Save,
    Moon,
    Sun,
    Bell,
    Shield,
    Globe,
    Smartphone,
    Mail
} from 'lucide-react';
import { MockService } from '../../../services/mockStore';

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<any>({
        monthlyFee: 0,
        missedPaymentPenalty: 0,
        currency: 'XAF',
        language: 'fr',
        notifications: true,
        darkMode: false
    });

    useEffect(() => {
        setSettings(MockService.getSettings());
    }, []);

    const handleUpdateSettings = (e: React.FormEvent) => {
        e.preventDefault();
        MockService.updateSettings(settings);
        alert('Paramètres mis à jour avec succès');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Paramètres du Système</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Settings Form */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleUpdateSettings} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-gray-500" /> Configuration Générale
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Frais Mensuels par Groupe (FCFA)</label>
                                <input
                                    type="number"
                                    value={settings.monthlyFee}
                                    onChange={(e) => setSettings({ ...settings, monthlyFee: Number(e.target.value) })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pénalité Retard Paiement (%)</label>
                                <input
                                    type="number"
                                    value={settings.missedPaymentPenalty}
                                    onChange={(e) => setSettings({ ...settings, missedPaymentPenalty: Number(e.target.value) })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Devise Système</label>
                                <div className="relative">
                                    <Globe className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none appearance-none bg-white"
                                    >
                                        <option value="XAF">XAF (FCFA)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="USD">USD ($)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Langue par défaut</label>
                                <select
                                    value={settings.language}
                                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none bg-white"
                                >
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button type="submit" className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200">
                                <Save className="h-4 w-4" /> Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preferences Side Panel */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Préférences</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {settings.darkMode ? <Moon className="h-5 w-5 text-purple-600" /> : <Sun className="h-5 w-5 text-orange-500" />}
                                    <span className="text-sm font-medium text-gray-700">Mode Sombre</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.darkMode}
                                        onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Bell className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">Notifications</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.notifications}
                                        onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h4 className="font-semibold text-blue-900 mb-2">Support Technique</h4>
                        <p className="text-sm text-blue-700 mb-4">Besoin d'aide pour configurer le système ?</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                                <Mail className="h-4 w-4" /> support@mosolocoop.com
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                                <Smartphone className="h-4 w-4" /> +237 699 99 99 99
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
