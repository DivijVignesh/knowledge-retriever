import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import { ChatProps, MessageProps } from '../types';
import { users } from '../data';

import Button from '@mui/joy/Button';
import Snackbar, { SnackbarOrigin } from '@mui/joy/Snackbar';
import Alert from '@mui/joy/Alert';
import axios from "axios";
axios.defaults.headers.post['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
// axios.defaults.headers.post['sessionid'] = localStorage.getItem('sessionid');

type MessagesPaneProps = {
  chat: ChatProps;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const { chat } = props;
  const [chatMessages, setChatMessages] = React.useState(chat.messages);
  const [textAreaValue, setTextAreaValue] = React.useState('');

  React.useEffect(() => {
    setChatMessages(chat.messages);
  }, [chat.messages]);

  interface State extends SnackbarOrigin {
    open: boolean;
  }
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ ...newState, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      <Snackbar
        open={open}
        onClose={handleClose}
        key='top+center'
      >
        I love snacks
      </Snackbar>

      <MessagesPaneHeader sender={chat.sender} />

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {chatMessages.map((message: MessageProps, index: number) => {
            const isYou = message.sender === 'You';
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={isYou ? 'row-reverse' : 'row'}
              >
                {message.sender !== 'You' && (
                  <AvatarWithStatus
                    online={message.sender.online}
                    src={message.sender.avatar}
                  />
                )}
                <ChatBubble variant={isYou ? 'sent' : 'received'} {...message} />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={() => {
          // setState({vertical: 'top', horizontal: 'right', open: true });
          // uncomment for snacktime
          console.log("Snack time")
          
          const handleDummy = async () => {

            const response = await axios.post("http://127.0.0.1:8000/api/query", {
              'query': textAreaValue
            });
            const answer = response.data['message'][0]
            const newId = chatMessages.length + 1;
            const newIdString = newId.toString();
            setChatMessages([
              ...chatMessages,
              {
                id: newIdString,
                sender: 'You',
                content: textAreaValue,
                timestamp: 'Just now',
              },
              {
                id: newIdString,
                sender: users[0],
                content: answer,
                timestamp: 'Just now',
              },
            ]);
          }
          handleDummy()
        }}
      />
    </Sheet>
  );
}
