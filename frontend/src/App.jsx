import React, { useState, useEffect } from 'react';
import {
  Container,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Box,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, RepeatIcon, SearchIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';
import Swal from 'sweetalert2';
import { FormErrorMessage } from '@chakra-ui/react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';


const MotionBox = motion(Box);
const MotionTr = motion(Tr);

const App = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newUser, setNewUser] = useState({ name: '', company_name: '', role: '', country: '' });
  const [errors, setErrors] = useState({});
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();


  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'rgba(23, 25, 35, 0.8)');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const headerGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.500, purple.600)'
  );

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // First try to fetch from our backend if running, otherwise use dummyjson
      try {
        const response = await axios.get('http://localhost:5000/users', { timeout: 5000 });
        setUsers(response.data);
      } catch (err) {
        console.warn('Backend not available, falling back to dummyjson');
        const response = await axios.get('https://dummyjson.com/users');
        const formattedUsers = response.data.users.map(u => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          company_name: u.company.name,
          role: u.role || 'N/A',
          country: u.address.country
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      toast({
        title: 'Error fetching users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Stop confetti after 15 seconds for an extended "wow" effect
    const timer = setTimeout(() => setShowConfetti(false), 15000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const validateForm = () => {
    const newErrors = {};
    if (!newUser.name || newUser.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    if (!newUser.company_name || newUser.company_name.trim() === '') {
      newErrors.company_name = 'Company name is required';
    }
    if (!newUser.role || newUser.role.trim() === '') {
      newErrors.role = 'Role is required';
    }
    if (!newUser.country || newUser.country.trim() === '') {
      newErrors.country = 'Country is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = () => {
    if (!validateForm()) return;

    const userToAdd = { ...newUser, id: Date.now() };
    setUsers([...users, userToAdd]);
    setNewUser({ name: '', company_name: '', role: '', country: '' });
    setErrors({});
    onClose();
    toast({
      title: 'User added locally',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };


  const handleDeleteUser = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3182ce',
      cancelButtonColor: '#e53e3e',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter(user => user.id !== id));
        Swal.fire(
          'Deleted!',
          'User has been deleted locally.',
          'success'
        );
      }
    });
  };


  return (
    <Box minH="100vh" bg={bgColor} py={10} px={4}>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          recycle={true}
          colors={[
            '#4285F4', // Google Blue
            '#EA4335', // Google Red
            '#FBBC05', // Google Yellow
            '#34A853', // Google Green
            '#805ad5', // Purple
            '#ffffff', // White
            '#63b3ed'  // Light Blue
          ]}
        />
      )}
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            p={8}
            borderRadius="2xl"
            bgGradient={headerGradient}
            color="white"
            shadow="xl"
          >
            <HStack justifyContent="space-between" wrap="wrap" spacing={4}>
              <VStack align="start" spacing={1}>
                <Heading size="xl" fontWeight="extrabold" letterSpacing="tight">
                  User Management
                </Heading>
                <Box opacity={0.8} fontWeight="medium">
                  Dynamic Dashboard • Real-time Data
                </Box>
              </VStack>
              <HStack spacing={4}>
                <IconButton
                  aria-label="Toggle dark mode"
                  icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                  variant="glass"
                  bg="whiteAlpha.200"
                  _hover={{ bg: 'whiteAlpha.300' }}
                  backdropFilter="blur(10px)"
                />
                <Button
                  leftIcon={<RepeatIcon />}
                  variant="solid"
                  bg="whiteAlpha.200"
                  _hover={{ bg: 'whiteAlpha.300' }}
                  backdropFilter="blur(10px)"
                  onClick={fetchUsers}
                  isLoading={loading}
                >
                  Refresh
                </Button>
                <Button
                  leftIcon={<AddIcon />}
                  bg="white"
                  color="blue.600"
                  _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                  _active={{ transform: 'translateY(0)' }}
                  onClick={onOpen}
                  fontWeight="bold"
                  shadow="lg"
                >
                  Add User
                </Button>
              </HStack>
            </HStack>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <InputGroup size="lg" shadow="sm">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="blue.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by name, company, role, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg={cardBg}
                borderWidth="2px"
                _focus={{ borderColor: 'blue.400', shadow: 'md' }}
                borderRadius="xl"
              />
            </InputGroup>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            overflow="hidden"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            bg={cardBg}
            backdropFilter="blur(20px)"
            shadow="2xl"
          >
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg={useColorModeValue('gray.100', 'whiteAlpha.50')}>
                  <Tr>
                    <Th color={textColor} py={5}>User</Th>
                    <Th color={textColor}>Company</Th>
                    <Th color={textColor}>Role</Th>
                    <Th color={textColor}>Country</Th>
                    <Th color={textColor} textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <MotionTr
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: index * 0.05 }}
                        _hover={{ bg: hoverBg }}
                        cursor="pointer"
                      >
                        <Td py={4}>
                          <VStack align="start" spacing={0}>
                            <Box fontWeight="bold" color={textColor}>{user.name}</Box>
                            <Box fontSize="xs" color="gray.500">#{user.id}</Box>
                          </VStack>
                        </Td>
                        <Td fontWeight="medium" color={textColor}>{user.company_name}</Td>
                        <Td>
                          <Box
                            px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold"
                            bg="blue.50" color="blue.600" display="inline-block"
                            _dark={{ bg: 'blue.900', color: 'blue.100' }}
                          >
                            {user.role}
                          </Box>
                        </Td>
                        <Td color={textColor}>{user.country}</Td>
                        <Td textAlign="right">
                          <IconButton
                            aria-label="Delete user"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            _hover={{ bg: 'red.50', color: 'red.600' }}
                            _dark={{ _hover: { bg: 'red.900', color: 'red.100' } }}
                            onClick={() => handleDeleteUser(user.id)}
                          />
                        </Td>
                      </MotionTr>
                    ))}
                  </AnimatePresence>
                  {filteredUsers.length === 0 && !loading && (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={10} color="gray.500">
                        No users found matching your search.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </MotionBox>
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent borderRadius="2xl" overflow="hidden">
            <ModalHeader bgGradient={headerGradient} color="white" py={6}>
              Add New User
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={8}>
              <VStack spacing={5}>
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel fontWeight="bold">Name</FormLabel>
                  <Input value={newUser.name} onChange={(e) => {
                    setNewUser({ ...newUser, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }} placeholder="Full Name" borderRadius="lg" />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.company_name}>
                  <FormLabel fontWeight="bold">Company</FormLabel>
                  <Input value={newUser.company_name} onChange={(e) => {
                    setNewUser({ ...newUser, company_name: e.target.value });
                    if (errors.company_name) setErrors({ ...errors, company_name: null });
                  }} placeholder="Company Name" borderRadius="lg" />
                  <FormErrorMessage>{errors.company_name}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.role}>
                  <FormLabel fontWeight="bold">Role</FormLabel>
                  <Input value={newUser.role} onChange={(e) => {
                    setNewUser({ ...newUser, role: e.target.value });
                    if (errors.role) setErrors({ ...errors, role: null });
                  }} placeholder="Role" borderRadius="lg" />
                  <FormErrorMessage>{errors.role}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.country}>
                  <FormLabel fontWeight="bold">Country</FormLabel>
                  <Input value={newUser.country} onChange={(e) => {
                    setNewUser({ ...newUser, country: e.target.value });
                    if (errors.country) setErrors({ ...errors, country: null });
                  }} placeholder="Country" borderRadius="lg" />
                  <FormErrorMessage>{errors.country}</FormErrorMessage>
                </FormControl>

                <Button
                  bgGradient={headerGradient}
                  color="white"
                  width="full"
                  size="lg"
                  _hover={{ opacity: 0.9, transform: 'scale(1.02)' }}
                  _active={{ transform: 'scale(0.98)' }}
                  onClick={handleAddUser}
                  borderRadius="xl"
                  shadow="lg"
                >
                  Create User
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default App;
