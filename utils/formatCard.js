const formatCard = (card) => {
    if (!card) return null;
    return {
        id: card.id,
        name: card.name,
        type: card.type,
        race: card.race,
        attribute: card.attribute,
        atk: card.atk,
        def: card.def,
        level: card.level,
        desc: card.desc,
        image_url: card.card_images?.[0]?.image_url_small,
    };
};

module.exports = { formatCard };