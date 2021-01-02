import { fetchCredits } from "../../../../../services/tgdb";

const mergeDuplicates = (credits) => {
  console.log(credits);

  return Object.values(
    credits.reduce((acc, credit) => {
      if (acc[credit.id]) {
        if (
          !acc[credit.id].first_person_roles.find(
            ({ job }) => job === credit.first_person_job
          )
        ) {
          acc[credit.id].first_person_roles.push({
            character: credit.first_person_character,
            department: credit.first_person_department,
            job: credit.first_person_job,
          });
        }
        if (
          !acc[credit.id].second_person_roles.find(
            ({ job }) => job === credit.second_person_job
          )
        ) {
          acc[credit.id].second_person_roles.push({
            character: credit.second_person_character,
            department: credit.second_person_department,
            job: credit.second_person_job,
          });
        }
      } else {
        acc[credit.id] = {
          id: credit.id,
          title: credit.title,
          release_date: credit.release_date,
          poster_path: credit.poster_path,
          first_person_roles: [
            {
              character: credit.first_person_character,
              department: credit.first_person_department,
              job: credit.first_person_job,
            },
          ],
          second_person_roles: [
            {
              character: credit.second_person_character,
              department: credit.second_person_department,
              job: credit.second_person_job,
            },
          ],
        };
      }
      return acc;
    }, {})
  );
};

export default async (req, res) => {
  const { first_person, second_person } = req.query;

  const firstPersonCreditsRes = await fetchCredits(first_person);
  const firstPersonCredits = await firstPersonCreditsRes.json();

  const secondPersonCreditsRes = await fetchCredits(second_person);
  const secondPersonCredits = await secondPersonCreditsRes.json();

  const compareCredit = (acc, credit) => {
    const secondCredit =
      secondPersonCredits.cast.find(({ id }) => id === credit.id) ||
      secondPersonCredits.crew.find(({ id }) => id === credit.id);
    if (!secondCredit) return acc;
    acc.push({
      id: credit.id,
      title: credit.title || credit.original_name,
      release_date: credit.release_date || credit.first_air_date,
      poster_path: credit.poster_path,
      first_person_character: credit.character,
      first_person_department: credit.department,
      first_person_job: credit.job || "Actor",
      second_person_character: secondCredit.character,
      second_person_department: secondCredit.department,
      second_person_job: secondCredit.job || "Actor",
    });
    return acc;
  };

  const allData = firstPersonCredits.cast
    .reduce(compareCredit, [])
    .concat(firstPersonCredits.crew.reduce(compareCredit, []));

  const data = mergeDuplicates(allData);

  res.status(200).json({
    data: data.sort(
      (a, b) =>
        new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    ),
  });
};
