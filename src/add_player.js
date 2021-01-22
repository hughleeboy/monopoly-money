import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import PlayerForm from './player_form'

const AddPlayer = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    
    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleSubmit = (values) => {
        setIsModalVisible(false)
        props.onAdd(values.player, values.amount)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const clearGame = () => {
        localStorage.setItem('notifications', JSON.stringify([]))
        localStorage.setItem('players', JSON.stringify([
            {
                key: 1,
                name: "Bank",
                money: 100000
            },{
                key: 2,
                name: "Free Parking",
                money: 0
            }
        ]))
        window.location.reload(false)
    }

    return (
        <div>
            <Button style={{margin: '20px'}} type="primary" onClick={showModal}>
               Add Player
            </Button>
            <Button type="secondary" onClick={clearGame}>
               Clear Game
            </Button>
            <Modal footer={null} title="Basic Modal" visible={isModalVisible} onCancel={handleCancel}>
                <PlayerForm onSubmit={handleSubmit} />
            </Modal>
        </div>
    )
}

export default AddPlayer