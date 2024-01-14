import math


def print_squares():
    """
    The range function enumerates over the numbers 0-9, for the range to be 1-10, simply use n+1 instead of n
    """

    for n in range(10):
        print(n + 1)


def average(list):
    """
    First check obvious cases where the input is invalid. Then also handle the case where the length the string zero.
    Finally, If both previous conditions don't pass, use the sum function, and length to get the average. And
    encapsulate it in a try to catch any other unexpected errors.
    """
    if list is None or type(list) is str:  # returns null for clearly wrong inputs
        return None
    elif len(list) == 0:  # returns 0 if the length of the list is 0 (empty list)
        return 0
    else:
        try:  # tries to sum elements in the list and catches any other errors
            return sum(list) / len(list)
        except:
            return None


def is_prime(n):
    """
    Quickly make sure that the input is non-zero and greater than 2. Then divide the number by numbers in the range
    of 3 to n/2. If it divides evenly, then it is not prime. Numbers after n/2 don't have to be checked because they
    will never be true.
    """
    if n <= 1 or n % 2 == 0:
        return False

    # check every number between 3 and n/2
    # 0-2 are already handled above
    # for any number greater than n/2, the quotient will
    #    never be an integer and will be between 1 and 2 so it can be ignored

    for y in range(int(n / 2))[3:]:
        if n % y == 0:  # if y divides evenly in n, then n is not prime
            return False
    return True


def prime_100():
    """
    Keep iterating through numbers Up to infinity until 100 prime numbers are discovered. Use the previously created
    is_prime function to check if the number is a prime, and can be added to the list.
    """
    prime_numbers = []
    n = 3  # three is the first prime
    while len(prime_numbers) < 100:
        if is_prime(n):
            prime_numbers.append(n)

        n += 2

    return prime_numbers


def count_letters(msg):
    """
    for each letter in the alphabet, use the "count" function and add the count to the dictionary
    """
    x = {}
    for letter in list("abcdefghijklmnopqrstuvwxyz"):
        x[letter] = msg.count(letter)
    return x


def filter_strings(str_list):
    """
    Check each string To see if it matches the conditions, add the string to the list being returned from the function.
    """
    lst = []
    for str1 in str_list:
        # make sure the element is a string before performing string operations
        if type(str1) is not list and len(str1) > 4 and (
                "a" in str1 or "e" in str1 or "i" in str1 or "o" in str1 or "u" in str1):
            lst.append(str1)
            # add the list elements to the new list if they meet the criteria
    return lst


def is_palindrome(num):
    """
    Check the first character with the last character, and then iterate both to move towards the center. A number
    that has an odd number of characters don't need its center character to be checked. (the character equals itself)
    """
    txt = str(num)

    for x in range(int(len(txt) / 2)):
        if txt[x] != txt[-x - 1]: # when txt[0] is checked, txt[-1] is checked
            return False
    return True


if __name__ == "__main__":
    print("Question 1")
    print_squares()
    print("Question 2")
    print(average([3, 4, 5, 6]))
    print(average([-2.3, 45, 0.111, 11 / 6]))
    print(average([]))  # Returns 0
    print(average([1.0, 1.0, -math.inf]))
    print(average([1, 3.14, "h"]))
    print(average("hello?"))
    print(average([1, 2, 3, 4].extend([5])))  # what happens here?

    print("Question 3")
    print(prime_100())

    print("Question 4")
    print(count_letters("The quick brown fox jumps over the lazy dog."))
    print(count_letters("Web serving with FastAPI!"))

    print("Question 5")
    print(filter_strings(["sda", "sajdasjdk", "jhgjhhtp", "732698"]))

    print("Question 6")
    print(is_palindrome(1234567.7654321))
    print(is_palindrome(-0.123))
