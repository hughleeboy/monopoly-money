import React, { useState } from 'react'
import { Table, Space, Button } from 'antd'
import AddPlayer from './add_player'

const Container = () => {

    const [players, setPlayers] = useState([
        {
            key: 1,
            name: "Free Parking",
            money: 0
        }
    ])
    const [notifications, setNotifications] = useState([])

    const handleAdd = (player, money) => { 
        // handling player update
        const new_player = {
            key: players.length + 1,
            name: player,
            money: money
        }
        const new_players = [ ...players, new_player]
        setPlayers(new_players)

        // handling notification update
        const new_notification = `Added player ` + player + ` with $` + money
        const new_notifications = [ ...notifications, new_notification]
        setNotifications(new_notifications)
        console.log(new_notifications)
    }

    const handlePay = (player, amount, reason) => {
        // handling player update
        const new_player = {
            ...player,
            money: player.money + amount
        }
        const players_copy = JSON.parse(JSON.stringify(players))
        const playerIdx = players_copy.findIndex((obj => obj.key === new_player.key))
        players_copy[playerIdx] = new_player        
        setPlayers(players_copy)

        // handling notification update
        const new_notification = `Paying ` + player.name + ` $` + amount + ` for ` + reason;
        const new_notifications = [ ...notifications, new_notification]
        setNotifications(new_notifications)
        console.log(new_notifications)
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
                    <Button type="link" block>
                        Pay Up
                    </Button>
                    <Button type="link" block>
                        Pay Day
                    </Button>
                    <Button type="link" block onClick={() => handlePay(record, 200, 'passing go')}>
                        Pass Go
                    </Button>
                    <Button type="link" block onClick={() => handlePay(record, 400, 'landing on go')}>
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
        </div>
    )
}

export default Container