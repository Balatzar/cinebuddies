import {
  fetchMediaDetailsAndCredits,
  fetchCredits,
} from "../../../../services/tgdb";

export default async (req, res) => {
  console.time(`Get collaborations`);
  const { id } = req.query;

  const personCreditsRes = await fetchCredits(id);
  const person = await personCreditsRes.json();
  const personCredits = person.combined_credits;

  const data = {};
  const fullData = personCredits.cast.concat(personCredits.crew);

  for (let i = 0; i < fullData.length; i++) {
    const mediaCredit = fullData[i];

    let mediaRes = await fetchMediaDetailsAndCredits(
      mediaCredit.id,
      mediaCredit.media_type
    );

    if (!mediaRes) continue;

    const media = await mediaRes.json();

    if (media.status_code === 34) continue;

    const fullCollab = media.credits.cast.concat(media.credits.crew);

    for (let ii = 0; ii < fullCollab.length; ii++) {
      const collab = fullCollab[ii];
      if (collab.id === id) continue;
      const newMedia = {
        title: media.title || media.name,
        release_date: media.release_date || media.first_air_date,
      };
      if (
        data[collab.id] &&
        !data[collab.id].medias.find(({ title }) => title === newMedia.title)
      ) {
        data[collab.id].medias.push(newMedia);
      } else {
        data[collab.id] = {
          name: collab.name,
          known_for_department: collab.known_for_department,
          medias: [newMedia],
        };
      }
    }
  }

  console.timeEnd(`Get collaborations`);
  console.log(person);

  res.status(200).json({
    name: person.name,
    collaborations: Object.values(data),
  });
};
