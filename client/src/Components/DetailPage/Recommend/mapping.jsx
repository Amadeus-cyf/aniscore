// function used to get the highest total score for recommendation 
function mapping(userList, map, id) {
    userList.forEach(user => {
        user.scoreAnime.forEach(anime => {
            if (anime.anime_id === id.toString()) {
                return;
            }
            if(map[anime.anime_id]) {
                map[anime.anime_id].score += anime.score;
            } else {
                map[anime.anime_id] = {
                    anime_id: anime.anime_id,
                    image_url: anime.image_url,
                    score: anime.score,
                    title: anime.title,
                }
            }
        })
    }) 
    let bangumis = Object.values(map);
    bangumis = bangumis.sort(function (first, second) {
        return second.score - first.score;
    })
    if (bangumis.length > 12) {
        bangumis = bangumis.slice(0, 12);
    }
    return bangumis;
}

export default mapping;