import React, { useEffect, useState } from "react";
import { Table, Space, Button, List, Input, Popover } from "antd";
import AddPlayer from "./add_player";
import GetMoney from "./transfer_money";

const clirules = (
  <div>
    <p>$$$ from p1 to p2,p3,p4 [for reason]</p>
    <p>$$$ to p1,p2,p3 from p4 [for reason]</p>
    <p>p1 pass</p>
    <p>p1 land</p>
    <p>p1 park</p>
  </div>
);

const Container = () => {
  const [players, setPlayers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [modalVisible, setModalVisible] = useState("");

  useEffect(() => {
    const test_players = JSON.parse(localStorage.getItem("players"))
      ? JSON.parse(localStorage.getItem("players"))
      : [
          {
            key: 1,
            name: "Bank",
            money: 100000,
          },
          {
            key: 2,
            name: "Free Parking",
            money: 0,
          },
        ];
    const test_notifications = JSON.parse(localStorage.getItem("notifications"))
      ? JSON.parse(localStorage.getItem("notifications"))
      : [];
    setPlayers(test_players);
    setNotifications(test_notifications);
  }, []);

  const inputUpdate = (event) => {
    if (event.nativeEvent.inputType === "insertText") {
      setInputVal(inputVal + event.nativeEvent.data);
    } else if (event.nativeEvent.inputType === "deleteContentBackward") {
      setInputVal(inputVal.substr(0, inputVal.length - 1));
    } else if (event.nativeEvent.inputType === "insertFromPaste") {
      setInputVal(inputVal + event.nativeEvent.data);
    }
  };

  const handleAdd = (player, money) => {
    // handling player update
    const new_player = {
      key: players.length + 1,
      name: player,
      money: money,
    };
    const new_players = [...players, new_player];
    setPlayers(new_players);
    localStorage.setItem("players", JSON.stringify(new_players));

    // handling notification update
    createNotification(`Added player ${player} with $${money}`);
  };

  const handleGo = (player, amount, reason) => {
    // handle the money exchange
    updateMoney(player, amount);

    // handling notification update
    createNotification(`Paying ${player.name} $${amount} for ${reason}`);
  };

  const handleTransfer = (player, other_info) => {
    // handle transferring money from one player to another
    const lucky_players = players.filter((player) =>
      other_info.players.includes(player.key)
    );

    // extracts the names of the lucky players with some magic js
    const lucky_player_names = lucky_players
      .reduce((total, player) => total + ", " + player.name, "")
      .substr(2);

    // handle the payment
    const players_copy = JSON.parse(JSON.stringify(players));
    lucky_players.forEach((lucky_player) => {
      lucky_player.money += other_info.amount;
      const playerIdx = players_copy.findIndex(
        (obj) => obj.key === lucky_player.key
      );
      players_copy[playerIdx] = lucky_player;
    });

    player.money -= lucky_players.length * other_info.amount;
    const playerIdx = players_copy.findIndex((obj) => obj.key === player.key);
    players_copy[playerIdx] = player;

    setPlayers(players_copy);
    localStorage.setItem("players", JSON.stringify(players_copy));

    createNotification(
      `${player.name} is giving ${lucky_player_names} $${other_info.amount} for ${other_info.reason}`
    );
  };

  const updateMoney = (player, amount) => {
    // handling player update
    const new_player = {
      ...player,
      money: player.money + amount,
    };
    const players_copy = JSON.parse(JSON.stringify(players));
    const playerIdx = players_copy.findIndex(
      (obj) => obj.key === new_player.key
    );
    players_copy[playerIdx] = new_player;
    setPlayers(players_copy);
    localStorage.setItem("players", JSON.stringify(players_copy));
  };

  const createNotification = (reason) => {
    const notifications_copy = JSON.parse(JSON.stringify(notifications));
    notifications_copy.unshift({ reason: reason, time: new Date() });
    setNotifications(notifications_copy);
    localStorage.setItem("notifications", JSON.stringify(notifications_copy));
  };

  const nameToKey = (name) => {
    let Candidates = players.filter((player) =>
      player.name.toLowerCase().startsWith(name.toLowerCase())
    );
    if (Candidates.length == 0) {
      createNotification(`could not find player matching ${name})`);
      return -1;
    }
    if (Candidates.length >= 2) {
      createNotification(`found multiple players matching ${name})`);
      return -1;
    }
    let key = Candidates[0].key;
    return key;
  };

  const nameToObj = (name) => {
    let Candidates = players.filter((player) =>
      player.name.toLowerCase().startsWith(name.toLowerCase())
    );
    if (Candidates.length == 0) {
      throw `could not find player matching ${name}`;
    }
    if (Candidates.length >= 2) {
      createNotification();
      throw `found multiple players matching ${name}`;
    }
    let p = Candidates[0];
    return p;
  };

  const handleInputEnter = (event) => {
    let cmd = inputVal.trim();
    let res = handleCommand(cmd);
    if (res) {
      setInputVal("");
    }
  };

  const handleCommand = (str) => {
    //"$$$ from p1 to p2,p3,p4 [for reason]"
    let trans1 = /^(\d+)\s+from\s+(\w+)\s+to\s+([\w,]+)(\s+for\s+([\w\s]+))?$/i;
    //"$$$ to p1,p2,p3 from p4 [for reason]"
    let trans2 = /^(\d+)\s+to\s+([\w,]+)\s+from\s+(\w+)(\s+for\s+([\w\s]+))?$/i;
    //"p1 pass"
    let pass = /^(\w+)\s+pass$/i;
    //"p1 land"
    let land = /^(\w+)\s+land$/i;
    //"p1 park"
    let park = /^(\w+)\s+park$/i;

    try {
      if (trans1.test(str)) {
        let match = trans1.exec(str);
        let namesTo = match[3].split(",");
        let playersTo = namesTo.map((name) => nameToKey(name));
        let playerFrom = nameToObj(match[2]);
        handleTransfer(playerFrom, {
          amount: parseInt(match[1]),
          players: playersTo,
          reason: match[5] ?? "reasons unknown",
        });
      } else if (trans2.test(str)) {
        let match = trans2.exec(str);
        let namesTo = match[2].split(",");
        let playersTo = namesTo.map((name) => nameToKey(name));
        let playerFrom = nameToObj(match[3]);
        handleTransfer(playerFrom, {
          amount: parseInt(match[1]),
          players: playersTo,
          reason: match[5] ?? "reasons unknown",
        });
      } else if (pass.test(str)) {
        let match = pass.exec(str);
        let player = nameToObj(match[1]);
        handleGo(player, 200, "passing go");
      } else if (land.test(str)) {
        let match = land.exec(str);
        let player = nameToObj(match[1]);
        handleGo(player, 400, "landing on go");
      } else if (park.test(str)) {
        let match = park.exec(str);
        let player = nameToKey(match[1]);
        let parkingCopy = nameToObj("free");
        handleTransfer(parkingCopy, {
          amount: parkingCopy.money,
          players: [player],
          reason: "free parking",
        });
      } else {
        throw "could not understand " + str;
        return false;
      }
    } catch (e) {
      createNotification("error:" + e);
      return false;
    }
    return true;
  };

  const columns = [
    {
      title: "Player",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ fontSize: "18px" }}>{record.name}</div>
      ),
    },
    {
      title: "Money",
      key: "money",
      render: (text, record) => (
        <div style={{ fontSize: "18px" }}>${record.money}</div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <GetMoney
            type="transfer"
            onTransfer={(other_info) => handleTransfer(record, other_info)}
            players={players}
          />
          <GetMoney
            type="spend"
            onTransfer={(other_info) => handleTransfer(record, other_info)}
            players={players}
          />
          <Button
            type="secondary"
            block
            onClick={() => handleGo(record, 200, "passing go")}
          >
            Pass Go
          </Button>
          <Button
            type="secondary"
            block
            onClick={() => handleGo(record, 400, "landing on go")}
          >
            On Go
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <AddPlayer onAdd={handleAdd} />

      <Table pagination={false} dataSource={players} columns={columns} />

      <Input
        placeholder="Scrubs use buttons"
        onChange={inputUpdate}
        addonAfter={
          <Popover content={clirules} title="The cli rules">
            <Button type="secondary" onClick={null}>
              Show Help
            </Button>
          </Popover>
        }
        size="large"
        value={inputVal}
        onPressEnter={handleInputEnter}
      />

      <List
        header={null}
        footer={null}
        bordered
        dataSource={notifications.reverse()}
        renderItem={(item) => <List.Item>{item.reason}</List.Item>}
      />
    </div>
  );
};

export default Container;
