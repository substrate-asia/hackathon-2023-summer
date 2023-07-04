import random

def generate_random_array(size):
  """Generates a random array of the specified size."""
  array = []
  for i in range(size):
    array.append(random.randint(0, 255))
  return array

def generate_hex_string(array):
  """Generates a hexadecimal string from the specified array."""
  hex_string = ""
  for byte in array:
    hex_string += "%02x" % byte
  return hex_string

def main():
  # Generate a 256-bit array.
  array = generate_random_array(16)

  # Convert the array to a hexadecimal string.
  hex_string = generate_hex_string(array)

  # Print the hexadecimal string.
  print(hex_string)

if __name__ == "__main__":
  main()
