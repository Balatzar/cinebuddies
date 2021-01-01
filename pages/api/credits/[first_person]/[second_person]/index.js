import { fetchCredits } from "../../../../../services/tgdb";

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
      title: credit.title,
      release_date: credit.release_date,
      poster_path: credit.poster_path,
      first_person_character: credit.character,
      first_person_department: credit.department,
      first_person_job: credit.job || "actor",
      second_person_character: secondCredit.character,
      second_person_department: secondCredit.department,
      second_person_job: secondCredit.job || "actor",
    });
    return acc;
  };

  const data = firstPersonCredits.cast
    .reduce(compareCredit, [])
    .concat(firstPersonCredits.crew.reduce(compareCredit, []));

  res.status(200).json({
    data,
  });
};
