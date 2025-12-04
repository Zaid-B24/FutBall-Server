// Store active teams in memory
const activeMatches = new Map();

const requestToPlay = (req, res) => {
  const username = req.user.username;
  console.log("username", username);
  const { map, characterName } = req.body;

  if (!map || !characterName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!activeMatches.has(map)) {
    activeMatches.set(map, {
      RED: [],
      BLUE: [],
    });
  }

  const currentMatch = activeMatches.get(map);

  const existingRed = currentMatch.RED.find((p) => p.username === username);
  if (existingRed) {
    return sendSuccess(
      res,
      existingRed.assignedNumber,
      "RED",
      map,
      "Rejoined RED team."
    );
  }

  const existingBlue = currentMatch.BLUE.find((p) => p.username === username);
  if (existingBlue) {
    return sendSuccess(
      res,
      existingBlue.assignedNumber,
      "BLUE",
      map,
      "Rejoined BLUE team."
    );
  }

  let assignedTeam = "";
  let assignedNumber = 0;

  if (currentMatch.RED.length < 5) {
    assignedTeam = "RED";
    assignedNumber = currentMatch.RED.length + 1;

    currentMatch.RED.push({ username, characterName, assignedNumber });
  } else if (currentMatch.BLUE.length < 5) {
    assignedTeam = "BLUE";
    assignedNumber = currentMatch.BLUE.length + 1;

    currentMatch.BLUE.push({ username, characterName, assignedNumber });
  } else {
    return res.status(400).json({ message: "Match on this map is full!" });
  }

  activeMatches.set(map, currentMatch);

  console.log(
    `Player ${username} assigned to ${assignedTeam} #${assignedNumber} on ${map}`
  );

  return sendSuccess(
    res,
    assignedNumber,
    assignedTeam,
    map,
    "Connection authorized."
  );
};

const sendSuccess = (res, assignedNumber, teamCode, map, message) => {
  const websocketUrl = process.env.WS_URL || "ws://localhost:8080";
  res.status(200).json({
    status: "success",
    data: {
      url: websocketUrl,
      assignedNumber: assignedNumber,
      teamCode: teamCode,
      map: map,
      message: message,
    },
  });
};

module.exports = { requestToPlay };
