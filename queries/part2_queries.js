db = db.getSiblingDB("spotify");

result_task1 = db.tracks.find({
   "audio_features.danceability": { $gt: 0.7 },
   "audio_features.energy" : {$gt: 0.7},
    duration_ms: {$gte: 180000, $lte: 300000}
}).toArray();

print("Завдання 1:");
printjson(result_task1);

result_task2 = db.tracks.aggregate([
    { 
        $unwind: "$artists" 
    },
    {
        $group:{
            _id: "$artists",
           totalTracks:{$sum:1},
           minPopularity: {$min:"$popularity"},
           avgPopularity:{$avg:"$popularity"}
        }
    },
    {
        $match:{
            totalTracks: {$gte:3},
            minPopularity:{$gte:60}
        }
    },
    {
        $project: {
            _id: 0,
            artist_name: "$_id",
            totalTracks: 1,
            minPopularity: 1,
            avgPopularity: { $round: ["$avgPopularity", 1] }
        }
    },
    {
        $sort: { avgPopularity: -1, totalTracks: -1 }
    },
    { 
        $limit: 20 
    }
]).toArray();

print("Завдання 2:");
printjson(result_task2);

result_task3 = db.tracks.aggregate([
    {
        $group:{
            _id: "$track_genre",
            avgTempo: {$avg: "$audio_features.tempo"},
            stdDev: {$stdDevPop: "$audio_features.tempo" },
            allTracks: { $push: "$$ROOT" }
        }
    },
    {
        $addFields:{
            outlierThreshold: {
                            $add:[
                                "$avgTempo",
                                {$multiply: [ 2, "$stdDev"] }
                            ]
            }
        }
    },
    {
        $unwind: "$allTracks"
    },
    {
        $match:{
                $expr: {
                    $gt: ["$allTracks.audio_features.tempo", "$outlierThreshold"]
                }
        }
    },
    {
        $group: {
        _id: "$_id",
        avg_tempo: { $first: "$avgTempo" },
        outlier_threshold: { $first: "$outlierThreshold" },
        outlier_tracks: {
            $push: {
            _id: "$allTracks._id",
            track_name: "$allTracks.track_name",
            popularity: "$allTracks.popularity",
            artists: "$allTracks.artists",
            audio_features: {
                tempo: "$allTracks.audio_features.tempo"
            }
            }
        }
        }
    },
    {
    $project: {
      _id: 0,
      genre: "$_id",
      avg_tempo: { $round: ["$avg_tempo", 0] },
      outlier_threshold: { $round: ["$outlier_threshold", 1] },
      outlier_tracks: 1
    }
  }
]).toArray();

print("Завдання 3:");
printjson(result_task3);

result_task4 = db.tracks.find({
   "audio_features.loudness": { $lt: -10 },
   "audio_features.speechiness" : {$lt: 0.1},
   "audio_features.instrumentalness": {$gt: 0.5},
   explicit: false
}).toArray();

print("Завдання 4:");
printjson(result_task4);
