import React, { useState, useEffect } from 'react';
import {
    UserCircle,
    Mail,
    Phone,
    Shield,
    KeyRound,
    LogOut,
    Edit,
    Camera,
    Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MockService } from '../../../services/mockStore';
import { AdminProfile } from '../../../types';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<AdminProfile>>({});

    useEffect(() => {
        const data = MockService.getAdminProfile();
        setProfile(data);
        setEditForm(data);
    }, []);

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (profile && editForm.fullName && editForm.email) {
            const success = MockService.updateAdminProfile(editForm);
            if (success) {
                setProfile({ ...profile, ...editForm });
                setIsEditing(false);
                alert("Profil mis à jour avec succès");
            } else {
                alert("Erreur lors de la mise à jour");
            }
        }
    };

    const handleLogout = () => {
        if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
            navigate('/login');
        }
    };

    if (!profile) return <div>Chargement...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800">Mon Profil Administrateur</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Background */}
                <div className="h-32 bg-gray-900 w-full relative">
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                            <LogOut className="h-4 w-4" /> Déconnexion
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-md">
                                <span className="text-3xl font-bold text-gray-600">{profile.fullName.charAt(0)}</span>
                            </div>
                            <button className="absolute bottom-0 right-0 p-1.5 bg-gray-800 text-white rounded-full hover:bg-gray-700 border border-white shadow-sm">
                                <Camera className="h-3 w-3" />
                            </button>
                        </div>
                        <div className="mb-2">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    <Edit className="h-4 w-4" /> Modifier le profil
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{profile.fullName}</h3>
                            <p className="text-gray-500 flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-500" /> {profile.role}
                            </p>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                                    <input
                                        type="text"
                                        value={editForm.fullName || ''}
                                        onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email || ''}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                    <input
                                        type="tel"
                                        value={editForm.phone || ''}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                                    <input
                                        type="text"
                                        value={editForm.address || ''}
                                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="flex items-end justify-end gap-2 md:col-span-2">
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); setEditForm(profile); }}
                                        className="px-4 py-2 text-gray-600 font-medium hover:text-gray-800"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        <Check className="h-4 w-4" /> Enregistrer
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-md shadow-sm">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email Professionnel</p>
                                        <p className="font-medium text-gray-900">{profile.email}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-md shadow-sm">
                                        <Phone className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Téléphone</p>
                                        <p className="font-medium text-gray-900">{profile.phone || "Non renseigné"}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4 md:col-span-2">
                                    <div className="p-2 bg-white rounded-md shadow-sm">
                                        <Shield className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Adresse</p>
                                        <p className="font-medium text-gray-900">{profile.address || "Non renseigné"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-gray-100">
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-gray-500" /> Sécurité
                            </h4>
                            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                <div>
                                    <p className="text-yellow-800 font-medium">Mot de passe</p>
                                    <p className="text-sm text-yellow-600 mt-1">Dernière modification : Il y a 3 mois</p>
                                </div>
                                <button className="text-sm font-medium text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded hover:bg-yellow-200 transition-colors">
                                    Modifier
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 text-xs text-center text-gray-400">
                            Dernière connexion : {profile.lastLogin}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
