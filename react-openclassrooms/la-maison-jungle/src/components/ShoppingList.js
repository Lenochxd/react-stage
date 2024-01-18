const plantList = [
    {
        name: 'monstera',
        category: 'classique',
        id: '1ed',
        isBestSale: true
    },
    'ficus lyrata',
    'pothos argenté',
    'yucca',
    'palmier'
]


function ShoppingList({categories}) {
    return (
        <ul>
            {plantList.map((plant, index) => (
                <li key={index}>
                    {typeof plant === 'object' ? (
                        <span>
                            {plant.name} {plant.isBestSale ? '🔥' : '👎'}
                        </span>
                    ) : (
                        <span>{plant}</span>
                    )}
                </li>
            ))}
        </ul>
    )
}

export default ShoppingList