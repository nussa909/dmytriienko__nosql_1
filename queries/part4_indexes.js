db = db.getSiblingDB("spotify");

result_task1_noidx = db.tracks.find({
  track_genre: "pop",
  "audio_features.danceability": { $gte: 0.7 }
}).sort({ popularity: -1 }).explain("executionStats");

print("Завдання 1, без індексу:")
printjson(result_task1_noidx);

db.tracks.createIndex({
  track_genre: 1,// equality
  popularity: -1, //sort
  "audio_features.danceability": 1, //range
});

result_task1_idx = db.tracks.find({
  track_genre: "pop",
  "audio_features.danceability": { $gte: 0.7 }
}).sort({ popularity: -1 }).explain("executionStats");

print("Завдання 1, з індексом:")
printjson(result_task1_idx);
////////////////////////////////////////////////////////

result_task2_noidx = db.tracks.find({
  "audio_features.speechiness": {$lt: 0.5},
  "audio_features.instrumentalness": { $gte: 0.5 },
  explicit: false
}).explain("executionStats");
print("Завдання 2, без індексу:")
printjson(result_task2_noidx);

db.tracks.createIndex({
  explicit: 1,
  "audio_features.speechiness": 1,
  "audio_features.instrumentalness": 1  
});

result_task2_idx = db.tracks.find({
  "audio_features.speechiness": {$lt: 0.5},
  "audio_features.instrumentalness": { $gte: 0.5 },
   explicit: false
}).explain("executionStats");
print("Завдання 2,з індексом:")
printjson(result_task2_idx);

/////////////////////////////////////////////////////
