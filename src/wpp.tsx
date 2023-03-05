import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, DatePicker, Input, Select, Switch, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { ChangeEvent, useCallback, useState } from "react";
import styled from "styled-components";

import './bg-image.png';
import { MESSAGES, USERS, WHATSAPP_COLORS, initialMessage, initialUser } from "./data";
import { IMessage, IUser } from "./interfaces";
import { rgbArrToHex } from "./utils";


const extraZero = (s: string) =>  `${s.length === 1 ? '0' : ''}${s}`;


type IdT<T> = T & {
  id: string;
}


function useObjList<T>(initialList: IdT<T>[]) {
  const [state, setState] = useState<IdT<T>[]>(initialList);

  const onChange = useCallback((name: keyof T, index: number) => (value: keyof T) => {
    setState((list: IdT<T>[]) => {
      // remark: list[index][name] had a TS warning
      list[index] = {
        ...list[index],
        [name]: value
      };
      return [ ...list ];
    });
  }, []);

  const handleChange = useCallback((index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof T, index)(value as keyof T);
  }, []);

  const onDelete = useCallback((index: number) => (_: any) => {
    setState((list: IdT<T>[]) => {
      return list.filter((_, i) => i !== index);
    })
  }, []);

  const onPush = useCallback((newItem: IdT<T>) => {
    setState((list: IdT<T>[]) => [
      ...list,
      { ...newItem }
    ]);
  }, []);

  return {
    editable: (name: keyof T, index: number) => {
      const value = state[index][name] as string;
      return (
        <Tooltip title={value} key={String(name)}>
          <Input
            name={name as string}
            onChange={handleChange(index)}
            value={value}
          />
        </Tooltip>
      )
    },
    viewable: state,
    onChange,
    removable: (index: number) => (
        <Button onClick={onDelete(index)} type="text" danger
          icon={<FontAwesomeIcon icon={faTrash} />} />
    ),
    onPush
  }
}


const FakeWhatsapp = () => {
  const [myUser, setMyUser] = useState<number>(1);
  const [warning, setWarning] = useState<boolean>(false);

  const {
    editable: InputUser,
    viewable: users,
    onChange: onChangeUser,
    removable: RemovableUser,
    onPush:   onPushUser
  } = useObjList<IUser>(USERS);
  
  const {
    editable: InputMessage,
    viewable: messages,
    onChange: onChangeMessage,
    removable: RemovableMessage,
    onPush:   onPushMessage
  } = useObjList<IMessage>(MESSAGES);

  const onChangeUserColor        = (index: number) => onChangeUser('color', index);
  const onChangeMessageTimestamp = (index: number) => onChangeMessage('timestamp', index);
  const onChangeMessageUserIndex = (index: number) => onChangeMessage('userIndex', index);
  const onChangeMessageMention   = (index: number) => onChangeMessage('mentionIndex', index);

  const UserSelect = useCallback((messageIndex: number) => {
    return (
      <MinWidthSelect<any> allowClear
        onChange={onChangeMessageUserIndex(messageIndex)}
        defaultValue={messages[messageIndex].userIndex}>
        {users.map((user, userIndex) => {
          return (
            <Select.Option key={userIndex} value={userIndex}>
              <span style={{ color: user.color }}>
                {user.savedName || user.originalName || user.cellphone}
              </span>
            </Select.Option>
          )
        })}
      </MinWidthSelect>
    );
  }, [users, messages]);

  const MessageMentionSelect = useCallback((messageIndex: number) => {
    return ( 
      <MinWidthSelect<any> className="message-mention" allowClear
        onChange={onChangeMessageMention(messageIndex)}
        defaultValue={messages[messageIndex].mentionIndex}>
        {messages.filter((_, _index) => _index < messageIndex).map((message, index) => {
          return (
            <Select.Option key={index} value={index}>
              {message.contents}
            </Select.Option>
          )
        })}
      </MinWidthSelect>
    );
  }, [messages]);

  const messagesJSX = messages.filter(m => m.userIndex !== -1).map((message, messageIndex) => {
    const user = message.userIndex < users.length ? users[message.userIndex] : null;

    if (user === null) {
      return <></>;
    }
    
    const messageMentioned = message.mentionIndex === undefined ? undefined : messages[message.mentionIndex];
    const userMentioned = messageMentioned && messageMentioned.userIndex < users.length && users[messageMentioned.userIndex];
    const isMe = message.userIndex === myUser;
    const previousMessage = messageIndex > 0 ? messages[messageIndex-1] : null;
    const moreMarginTop = previousMessage && previousMessage.userIndex !== message.userIndex;
    const hours = extraZero(String(new Date(message.timestamp).getHours())),
          minutes = extraZero(String(new Date(message.timestamp).getMinutes()));

    return (
      <MessageContainer key={messageIndex} me={isMe} className={`mx-5 mt-${moreMarginTop ? 3 : 1} py-1 px-2 d-flex flex-column`}>
        <MessageUsername color={user.color}>
          <span className="primary">
            {user.savedName || user.cellphone}
          </span>
          {!user.savedName && (
            <span className="ms-1 secondary">
              ~{user.originalName}
            </span>
          )}
        </MessageUsername>
        <MessageBody>
          {message.mentionIndex !== undefined && userMentioned && (
            <MessageMention me={isMe} color={userMentioned?.color} className="my-1 px-2 py-1">
              <MessageUsername color={userMentioned?.color}>
                <span className="primary">
                  {userMentioned.savedName || userMentioned.cellphone}
                </span>
                {!userMentioned.savedName && (
                  <span className="ms-1 secondary">
                    ~{userMentioned.originalName}
                  </span>
                )}
              </MessageUsername>
              {messageMentioned && messageMentioned.contents}
            </MessageMention>
          )}
          {message.contents}
        </MessageBody>
        <MessageTimestamp>
          {hours}:{minutes}
        </MessageTimestamp>
      </MessageContainer>
    )
  });

  const handleNewUser = useCallback(() => {
    onPushUser(initialUser);
  }, []);

  const handleNewMessage = useCallback(() => {
    onPushMessage(initialMessage);
  }, []);

  const handleSetWarning = useCallback((value: boolean) => {
    setWarning(value);
  }, []);

  const userColumns = [
    {
      dataIndex: 'cellphone',
      title: 'Cellphone',
      render: (_: any, __: any, index: number) => InputUser('cellphone', index)
    },
    {
      dataIndex: 'savedName',
      title: 'Saved Name',
      render: (_: any, __: any, index: number) => InputUser('savedName', index)
    },
    {
      dataIndex: 'originalName',
      title: 'Original name',
      render: (_: any, __: any, index: number) => InputUser('originalName', index)
    },
    {
      dataIndex: 'color',
      title: 'Color',
      render: (value: any, _: any, index: number) => (
        <MinWidthSelect<any> onChange={onChangeUserColor(index)} defaultValue={value} key={index}>
          {WHATSAPP_COLORS.map(color => {
            const rgb = rgbArrToHex(color);
            return (
              <Select.Option key={rgb} value={rgb}>
                <span style={{ color: rgb }}>{rgb}</span>
              </Select.Option>
            )
          })}
        </MinWidthSelect>
      )
    },
    {
      dataIndex: "actions",
      title: 'Actions',
      render: (_: any, __: any, index: number) => RemovableUser(index)
    }
  ];

  const messageColumns = [
    {
      dataIndex: "author",
      title: 'Author',
      render: (_: any, __: any, index: number) => UserSelect(index)
    },
    {
      dataIndex: 'timestamp',
      title: 'Timestamp',
      render: (value: string | number | dayjs.Dayjs | Date | null | undefined, _: any, index: number) => (
        <DatePicker value={dayjs(value)} format="YYYY-MM-DD HH:mm" showTime={true}
          onChange={onChangeMessageTimestamp(index) as any} allowClear={false}/>
      )
    },
    {
      dataIndex: "contents",
      title: 'Contents',
      render: (_: any, __: any, index: number) => InputMessage('contents', index)
    },
    {
      dataIndex: "mentions",
      title: 'Message mentioned',
      render: (_: any, __: any, index: number) => MessageMentionSelect(index)
    },
    {
      dataIndex: "actions",
      title: 'Actions',
      render: (_: any, __: any, index: number) => RemovableMessage(index)
    }
  ];
  
  return (
    <div className="h-100 d-flex">
      
      <Edition className="w-100 h-100 p-5" key="edition">
        <label>
          Set fake news warning
          <Switch className="ms-2" checked={warning} onChange={handleSetWarning} />
        </label>
        <h1>Users</h1>
        <Table<IUser> dataSource={users} pagination={false} key="messages"
          rowKey="id"
          columns={userColumns}
        />
        <Button className="mt-2" onClick={handleNewUser}>New user</Button>

        <h1 className="mt-5">Messages</h1>
        <Table<IMessage> dataSource={messages} pagination={false} key="users"
          rowKey="id"
          columns={messageColumns}
        />
        <Button className="mt-2" onClick={handleNewMessage}>New message</Button>

      </Edition>

      <Main className="w-100 h-100 d-flex flex-column" key="mes">
        <BackgroundImage className="w-100 h-100" />
        {messagesJSX}
        {warning && (
          <>
            <WarningBackground className="w-100 h-100" />
            <WarningText className="w-100 h-100 d-flex justify-content-center align-items-center">
              FAKE NEWS
            </WarningText>
          </>
        )}
      </Main>

    </div>
  );
}

const WarningBackground = styled.div`
  position: absolute;
  background: red;
  opacity: 0.1;
`;

const WarningText = styled.div`
  max-width: 200px;
  max-height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  color: white;
  font-size: 100px;
  transform: rotate(45deg);
  z-index: 1;
`

const Edition = styled.div`
  background: #005C4B;
  color: white;
  overflow-y: auto;

  &, h1 {
    color: white;
  }

  td, th {
    max-width: 180px;
    border: 1px solid gray;
    padding: 5px;
    input {
      max-width: 100%;
      color: black; 
    }
    &.short-input input {
      max-width: 30px;
      text-align: center;
    }
    &.datetime-input input {
      min-width: 120px;
    }
  }

  .message-mention {
    width: 100px;
  }
`;

const Main = styled.div`
  position: relative;
  background: #0B141A;
`;

const BackgroundImage = styled.div`
  position: absolute;
  background-image: url("/static/media/bg-image.39f53e74f66d348d9f7c.png");
  opacity: 0.06;
`;

const MessageContainer = styled.div<{
  me: boolean
}>`
  min-width: 200px;
  max-width: 50%;
  margin-${({ me }) => me ? 'left': 'right'}: auto !important;
  background: ${({ me }) => me ? '#005C4B' : '#202C33'};
  border-radius: 5px;
  z-index: 0;
`

const MessageUsername = styled.div<{
  color: string;
}>`
  &:hover {
    cursor: pointer;
  }

  .primary {
    color: ${({ color }) => color};
  }

  .primary:hover,
  .secondary:hover {
    text-decoration: underline;
    &.primary {
      text-decoration-color: ${({ color }) => color};
    }
    &.secondary {
      text-decoration-color: #757F84;
    }
  }

  .secondary {
    color: #757F84;
  }
`;

const MessageBody = styled.div`
  color: white;
`

const MessageMention = styled.div<{
  color: string;
  me: boolean;
}>`
  background: ${({ me }) => me ? '#025144' : '#1D282F'};
  border-radius: 5px;
  border-left: 4px solid ${({ color }) => color};
  color: #A5A9AC;
  margin-left: -5px;
`;

// to-do: timestamp with negative margin and element above with almost-zero margin-right

const MessageTimestamp = styled.div`
  font-size: 12px;
  color: #90959A;
  text-align: right;
`;

const MinWidthSelect = styled(Select)`
  min-width: 80px;
  .ant-select-item-option-content {
    text-align: center !important;
  }
`

export default FakeWhatsapp;