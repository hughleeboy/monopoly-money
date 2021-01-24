import React, { useEffect, useState } from 'react'
import { Table, Space, Button, List } from 'antd'
import AddPlayer from './add_player'
import GetMoney from './transfer_money'

const Container = () => {

    const [players, setPlayers] = useState([])
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const test_players = JSON.parse(localStorage.getItem('players')) ? JSON.parse(localStorage.getItem('players')) : [
            {
                key: 1,
                name: "Bank",
                money: 100000
            },{
                key: 2,
                name: "Free Parking",
                money: 0
            }
        ]
        const test_notifications = JSON.parse(localStorage.getItem('notifications')) ? JSON.parse(localStorage.getItem('notifications')) : []
        setPlayers(test_players)
        setNotifications(test_notifications)
    },[])

    const handleAdd = (player, money) => { 
        // handling player update
        const new_player = {
            key: players.length + 1,
            name: player,
            money: money
        }
        const new_players = [ ...players, new_player]
        setPlayers(new_players)
        localStorage.setItem('players', JSON.stringify(new_players))

        // handling notification update
        createNotification(`Added player ${player} with $${money}`)
    }

    const handleGo = (player, amount, reason) => {
        // handle the money exchange
        updateMoney(player, amount)

        // handling notification update
        createNotification(`Paying ${player.name} $${amount} for ${reason}`)
    }

    const handleTransfer = (player, other_info) => {
        // handle transferring money from one player to another
        const lucky_players = players.filter(player => other_info.players.includes(player.key))
        
        // extracts the names of the lucky players with some magic js
        const lucky_player_names = lucky_players.reduce((total, player) => total + ", " + player.name, "").substr(2);

        
        // handle the payment
        const players_copy = JSON.parse(JSON.stringify(players))
        lucky_players.forEach(lucky_player => {
            lucky_player.money += other_info.amount
            const playerIdx = players_copy.findIndex((obj => obj.key === lucky_player.key))
            players_copy[playerIdx] = lucky_player
        })
        
        player.money -= (lucky_players.length * other_info.amount)
        const playerIdx = players_copy.findIndex((obj => obj.key === player.key))
        players_copy[playerIdx] = player
        
        setPlayers(players_copy)
        localStorage.setItem('players', JSON.stringify(players_copy))

        createNotification(`${player.name} is giving ${lucky_player_names} $${other_info.amount} for ${other_info.reason}`)
    }

    const updateMoney = (player, amount) => {
        // handling player update
        const new_player = {
            ...player,
            money: player.money + amount
        }
        const players_copy = JSON.parse(JSON.stringify(players))
        const playerIdx = players_copy.findIndex((obj => obj.key === new_player.key))
        players_copy[playerIdx] = new_player        
        setPlayers(players_copy)
        localStorage.setItem('players', JSON.stringify(players_copy))
    }

    const createNotification = (reason) => {
        const notifications_copy = JSON.parse(JSON.stringify(notifications))
        notifications_copy.unshift({reason: reason, time: new Date()})
        setNotifications(notifications_copy)
        localStorage.setItem('notifications', JSON.stringify(notifications_copy))
    }

    const columns = [
        {
            title: 'Player',
            dataIndex: 'name',
            key: 'name',
        },{
            title: 'Money',
            key: 'money',
            render: (text, record) => (
                <div>
                    ${record.money}
                </div>
            ),
        },{
            title: 'Action',
            key: 'action',
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
                    <Button type="secondary" block onClick={() => handleGo(record, 200, 'passing go')}>
                        Pass Go
                    </Button>
                    <Button type="secondary" block onClick={() => handleGo(record, 400, 'landing on go')}>
                        On Go
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <AddPlayer onAdd={handleAdd}/>

            <Table 
                pagination={false}
                dataSource={players} 
                columns={columns} 
            />

            <List
                header={null}
                footer={null}
                bordered
                dataSource={notifications.reverse()}
                renderItem={item => (
                    <List.Item>
                        {item.reason}
                    </List.Item>
                )}
            />

        </div>
    )
}

export default Container