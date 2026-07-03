db = db.getSiblingDB("spotify");

result_task1 = db.tracks.aggregate([
    { 
        $unwind: "$artists" 
    },
    {
        $group:{
            _id: "$artists",
           totalTracks:{$sum:1},
           avgPopularity:{$avg:"$popularity"}
        }
    },
    {
        $match:{
            totalTracks: {$gte:5}
        }
    },
    {
        $project: {
            _id: 0,
            artist_name: "$_id",
            avgPopularity: { $round: ["$avgPopularity", 1] }
        }  
    },
    {
        $sort: { avgPopularity: -1}
    },
    {
        $limit: 10
    }
]).toArray();

print("Завдання 1:");
printjson(result_task1);

result_task2 = db.tracks.aggregate([
{
    $addFields: {
        mood: {
            $switch: {
            branches: [
                //happy
                {
                case: { 
                    $and: [ 
                    { $gte: ["$audio_features.valence", 0.5] }, 
                    { $gte: ["$audio_features.energy", 0.5] } 
                    ] 
                },
                then: "happy"
                },
                //angry
                {
                case: { 
                    $and: [ 
                    { $lt: ["$audio_features.valence", 0.5] }, 
                    { $gte: ["$audio_features.energy", 0.5] } 
                    ] 
                },
                then: "angry"
                },
                //calm
                {
                case: { 
                    $and: [ 
                    { $gte: ["$audio_features.valence", 0.5] }, 
                    { $lt: ["$audio_features.energy", 0.5] } 
                    ] 
                },
                then: "calm"
                },
                //sad
                {
                case: { 
                    $and: [ 
                    { $lt: ["$audio_features.valence", 0.5] }, 
                    { $lt: ["$audio_features.energy", 0.5] } 
                    ] 
                },
                then: "sad"
                }
            ],
            default: "unknown"
            }
            }
        }
    },
    {
        $group: {
            _id: "$mood",
            totalTracks: {$sum:1}
        }
    },
    {
        $project:{
            _id:0,
            mood:"$_id",
            totalTracks:1
        }
    }
]).toArray();

print("Завдання 2:");
printjson(result_task2);

result_task3 = db.tracks.aggregate([
    {
        $group:{
           _id: "$track_genre",
           totalTracks: {$sum:1},
           avg_danceability: {$avg: "$audio_features.danceability"},
           avg_energy: {$avg: "$audio_features.energy"},
           avg_valence: {$avg: "$audio_features.valence"}
        }  
    },
    {
        $match:{
            totalTracks: {$gte: 100}
        }
    },

    {
        $project:{
            _id:0,
            genre: "$_id",
            avg_danceability: 1,
            avg_energy:1,
            avg_valence:1,
            totalTracks:1 
        }
    },
    {
        $sort: {avg_danceability:-1}
    },
    {
        $limit: 1
    }
]).toArray();

print("Завдання 3:");
printjson(result_task3);
