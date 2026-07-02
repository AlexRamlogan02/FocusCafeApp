import { useState } from 'react'
import MenuCard from '../components/MenuCard.component.jsx'
import { menuItems as mockMenuItems } from '../mocks/session.js'
import SessionSettings from '../components/SessionSettings.component.jsx'

const normalizeMenuItems = (payload) => {
    if (!payload) return []

    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload.menu)) return payload.menu

    return []
}

const buildAssetUrl = (assetLink) => {
    if (!assetLink) return ''
    if (assetLink.startsWith('http://') || assetLink.startsWith('https://')) return assetLink
    return assetLink
}

export default function MenuPage() {
    const menuItems = normalizeMenuItems(mockMenuItems)

    const [selectedItem, setSelectedItem] = useState(null)

    return (
        <section className="space-y-6">
            <div className="space-y-3 text-center">
                <h1 className="text-3xl font-bold text-[var(--text-color)]">Menu</h1>
                <p className="mx-auto max-w-2xl text-[var(--text-color)]/80">
                    Choose a menu item to adjust your focus session settings.
                </p>
            </div>

            {selectedItem && (<SessionSettings
                item={selectedItem}
                onChangeFocus={(newFocus) => console.log('New focus duration:', newFocus)}
                onSelectBreak={(newBreak) => console.log('New break duration:', newBreak)}
                onSelectSessions={(newSessions) => console.log('New number of sessions:', newSessions)} />)
            }

            <div className="grid gap-6 md:grid-cols-2">
                {menuItems.map((item, index) => (
                    <MenuCard
                        key={item.item || index}
                        title={item.item}
                        description={`${item.item} is ready for your next focus session.`}
                        imgSrc={buildAssetUrl(item.assetLink)}
                        onClick={() => setSelectedItem(item)}
                    />
                ))}
            </div>

        </section>
    )
}