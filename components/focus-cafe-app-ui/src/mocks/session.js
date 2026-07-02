export const sessions = [
    {
        drink: "Matcha",
        custom: null,
        preset: 1, //25 min focus, 5 min break,
        taskList: [
            {
                priority: 1, //low, med, high
                desc: "Create Framework"
            },
            {
                priority: 2, //low, med, high
                desc: "Draft API Layer"
            }
        ]
    }
]

export const menuItems = [
    {
        item: 'Lemonade',
        assetLink: 'assets/menu/lemonade'
    },
    {
        item: 'Matcha',
        assetLink: 'assets/menu/matcha'
    }
]

/* 
    GUIDE: 
    Timer Presets: 
        1 => 25/5
        2 => 50/10
        3 => 60/20
        null => default to custom timer
    Priority: 
        1 => low
        2 => med
        3 => high

*/