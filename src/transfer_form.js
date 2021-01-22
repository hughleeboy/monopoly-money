import * as React from 'react'
import { Form, Select, InputNumber, Input, Button } from 'antd'
  
const { Option } = Select
const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } }
  

const TransferForm = (props) => {
    const onFinish = (values) => {
        props.onSubmit(values)
    }
  
    const not_transfer = props.type && props.type !== "transfer"

    const initial_values = not_transfer ? {
        ['players']: [1]
    } : {
        ['players']: []
    }

    return (
        <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={onFinish}
            initialValues={initial_values}
        >

            <Form.Item
                name="players"
                label="Trasnfer To"
                rules={[{ required: true, type: 'array' }]}
            >
                <Select disabled={not_transfer} mode="multiple" placeholder="Who is getting the money?">
                    {props.players ? props.players.map(
                        (player) => <Option key={player.key} value={player.key}>{player.name}</Option>
                    ) : <div />}
                </Select>
            </Form.Item>

            <Form.Item 
                name="amount" 
                label="Money"
                rules={[{ required: true }]}
            >
                <InputNumber style={{width: "100%"}} placeholder="How much money?" min={0} max={5000} />
            </Form.Item>

            <Form.Item
                name="reason"
                label="Reason"
                rules={[{ required: true }]}
            >
                <Input placeholder="Why are you transferring?" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>

        </Form>
    )
}

export default TransferForm