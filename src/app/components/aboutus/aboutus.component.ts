import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aboutus',
  imports: [CommonModule],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {
portfolioItems = [
  { title: 'Threads', category: 'Illustration' },
  { title: 'Explore', category: 'Graphic Design' },
  { title: 'Finish', category: 'Identity' },
  { title: 'Lines', category: 'Branding' },
  { title: 'Southwest', category: 'Website Design' },
  { title: 'Window', category: 'Photography' },
];

aboutTimeline = [
  {
    date: '2009-2011',
    title: 'Our Humble Beginnings',
    description:
      'We started small, learning and growing with each project we took on.',
  },
  {
    date: 'March 2011',
    title: 'An Agency is Born',
    description:
      'The official launch of our agency marked the beginning of a new era.',
  },
  {
    date: 'December 2015',
    title: 'Transition to Full Service',
    description:
      'We expanded our offerings to become a one-stop shop for digital solutions.',
  },
  {
    date: 'July 2020',
    title: 'Phase Two Expansion',
    description:
      'Our team grew, our clients diversified, and we took on even bigger challenges.',
  },
];

}
